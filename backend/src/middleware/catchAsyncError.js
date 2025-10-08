const catchAsyncError = (thisFunction) => {
  return (req, res, next) => {
    Promise.resolve(thisFunction(req, res, next)).catch(next);
  };
};
export default catchAsyncError;

// promise function ko resolee krega agr nhi hoga resolve to catch krega or next ko dega if erro next error ko catch krega erorhandler ko dedega
