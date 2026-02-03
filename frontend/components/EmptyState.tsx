"use client";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center text-gray-600">
      <p className="mb-4">No results found.</p>
      <p>Try removing filters or adjusting your search.</p>
    </div>
  );
}
