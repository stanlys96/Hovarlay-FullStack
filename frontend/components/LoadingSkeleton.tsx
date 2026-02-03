"use client";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="p-4 rounded space-y-2">
          <div className="bg-gray-300 h-40 w-full rounded" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
