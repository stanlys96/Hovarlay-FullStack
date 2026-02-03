"use client";
import { useMemo } from "react"
import SearchInput from "./SearchInput"
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { debounce } from "@/lib/debounce";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const authContext = useAuth();
    const params = authContext?.params;
    const pathname = usePathname();
    const { data: session } = useSession();
    const debouncedSetQuery = useMemo(
        () => debounce((value: string) => {
            const isDelete = !value?.trim();
            authContext?.updateSearchParams('q', value, isDelete ? "delete" : "set");
        }, 400),
        [authContext]
    );
    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand */}
                <div
                    onClick={() => {
                        router.push(`/?${params?.toString()}`)
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
                        P
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        Product Explorer
                    </h1>
                </div>
                {/* Search */}
                {pathname === "/" && <div className="w-full md:w-[380px]">
                    <SearchInput value={params?.get("q") || ""} onChange={(val: string) => debouncedSetQuery(val)} />
                </div>}
                {!session?.user ? <button
                    onClick={() => router.push("/login")}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 20.25a7.5 7.5 0 0115 0"
                        />
                    </svg>
                    Sign in
                </button> : (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                        {session.user.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name ?? "User avatar"}
                                className="h-9 w-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                                {session.user.name?.[0] ?? "U"}
                            </div>
                        )}
                        {/* User info */}
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-medium text-gray-800">
                                {session.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {session.user.email}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="mx-2 h-6 w-px bg-gray-200" />

                        {/* Sign out */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18 12H9m0 0l3-3m-3 3l3 3"
                                />
                            </svg>
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}