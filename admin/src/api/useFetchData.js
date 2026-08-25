import { useState, useEffect, useCallback, useReducer, useRef } from "react";

// In-memory cache stored outside the hook to persist across component remounts.
const cache = new Map();

export function clearFetchCache() {
  cache.clear();
}

const initialState = {
  data: [],
  totalCount: 0,
  loading: true,
  error: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload.data, totalCount: action.payload.totalCount };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

/**
 * A custom hook to fetch data from a given API function.
 * @param {Function} apiFunc - The function that fetches the data.
 * @param {Object} initialParams - Initial parameters to pass to the API function (e.g., { page: 1, limit: 10 }).
 * @returns {{data: any[], totalCount: number, loading: boolean, error: Error|null, refetch: Function, setParams: Function}}
 */
export const useFetchData = (apiFunc, initialParams = {}) => {
  const [params, setParams] = useState(initialParams);

  // Generate a cache key from the function's identity and its parameters
  const cacheKey = `${apiFunc.name || 'apiFunc'}-${JSON.stringify(params)}`;

  const [state, dispatch] = useReducer(fetchReducer, cache.get(cacheKey) || initialState);

  const fetchData = useCallback(async (forceRefetch = false) => {
    if (!forceRefetch && cache.has(cacheKey)) {
      // If we have cached data and we are not forcing a refetch, do nothing.
      // The initial state is already set from the cache.
      return;
    }

    dispatch({ type: "FETCH_START" });
    try {
      const response = await apiFunc(params);
      // Assuming the API response structure is { data: [...], totalCount: N }
      const payload = { data: response?.data || response || [], totalCount: response?.totalCount || 0 };
      dispatch({ type: "FETCH_SUCCESS", payload });
      cache.set(cacheKey, { ...initialState, ...payload, loading: false }); // Update cache with new data
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err });
    }
  }, [apiFunc, params, cacheKey]);

  // Adjust params state during render when initialParams change
  const [prevInitialParams, setPrevInitialParams] = useState(initialParams);
  if (JSON.stringify(prevInitialParams) !== JSON.stringify(initialParams)) {
    setPrevInitialParams(initialParams);
    setParams(initialParams);
  }

  useEffect(() => {
    // On mount or when params change, fetch data.
    // The `fetchData` function itself will decide whether to use the cache or fetch.
    fetchData(false);
  }, [fetchData, params]); // Re-fetch when params change

  // The public refetch function will always force a network request.
  const forceRefetch = useCallback(() => fetchData(true), [fetchData]);

  return { ...state, refetch: forceRefetch, setParams };
};