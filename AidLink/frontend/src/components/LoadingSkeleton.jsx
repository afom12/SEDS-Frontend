import React from 'react';

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-gray-200 flex items-center px-6">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 ml-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 ml-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 ml-4"></div>
        </div>
      ))}
    </div>
  </div>
);

export const RequestCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export default CardSkeleton;

