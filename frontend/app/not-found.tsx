"use client";

import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-lg">
                {/* Icon */}
                <svg
                    className="mx-auto h-20 w-20 text-blue-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                </svg>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    Sorry, we couldn’t find the page you’re looking for. It might have been removed or the URL is incorrect.
                </p>

                {/* Button */}
                <button
                    onClick={() => router.push("/")}
                    className="px-6 cursor-pointer py-3 bg-blue-600 text-white font-medium rounded-xl shadow transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
}
