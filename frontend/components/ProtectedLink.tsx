"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

interface ProtectedLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function ProtectedLink({ href, children, className }: ProtectedLinkProps) {
    const { data: session } = useSession();

    const handleClick = (e: React.MouseEvent) => {
        if (!session) {
            e.preventDefault(); // prevent default link navigation
            toast.error("You must be signed in to access this page!");
        }
    };

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
