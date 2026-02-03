"use client";

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
    // Use NextAuth or Google SDK
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer text-[18px]"
    >
      {/* Google Icon */}
      <svg
        className="h-5 w-5"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h146.9c-6.3 34.2-25 63.2-53.2 82.6v68h85.9c50.3-46.3 81.9-114.5 81.9-195.4z"
          fill="#4285F4"
        />
        <path
          d="M272 544.3c72.6 0 133.5-24.1 178-65.5l-85.9-68c-23.9 16-54.5 25.5-92.1 25.5-70.8 0-130.8-47.8-152.3-112.1h-90.4v70.5C73.7 475.2 167.5 544.3 272 544.3z"
          fill="#34A853"
        />
        <path
          d="M119.7 324.2c-10.3-30.2-10.3-62.8 0-93l-90.4-70.5C-8.6 233.6-8.6 310.7 29.3 387.7l90.4-63.5z"
          fill="#FBBC05"
        />
        <path
          d="M272 107.7c39.5-.6 77.7 14 106.8 40.9l80-80C408.6 24.7 343.5-1.3 272 0 167.5 0 73.7 69.1 29.3 160.7l90.4 70.5C141.2 155.5 201.2 107.7 272 107.7z"
          fill="#EA4335"
        />
      </svg>

      <span>Continue with Google</span>
    </button>
  );
}
