"use client";

export default function SingleLoadingSkeleton() {
    return (
        <div className="border p-4 rounded space-y-2 max-w-4xl mx-auto">
            <div className="bg-gray-300 h-40 w-full rounded" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
    );
}