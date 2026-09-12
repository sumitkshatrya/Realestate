import React from "react";

export const PropertyCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm animate-pulse flex flex-col justify-between">
    <div>
      <div className="h-64 bg-slate-200 w-full" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
        <div className="grid grid-cols-3 gap-2 py-3 bg-slate-100 rounded-2xl h-14" />
      </div>
    </div>
    <div className="px-6 pb-6 pt-0 flex gap-2">
      <div className="h-10 bg-slate-200 rounded-xl w-24" />
      <div className="h-10 bg-slate-200 rounded-xl flex-1" />
    </div>
  </div>
);

export const PropertyGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);

export default PropertyGridSkeleton;

