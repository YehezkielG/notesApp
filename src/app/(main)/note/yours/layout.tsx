"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Lock, Globe } from "lucide-react";

export default function YoursLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const currentIsPrivate = pathname.includes("/note/yours/private");

    const tabClass = (active: boolean) =>
        `p-3 flex items-center justify-center gap-2 text-center w-1/2 text-lg font-semibold cursor-pointer ${
            active
                ? "bg-gray-900/15 text-gray-900"
                : "text-gray-500 hover:text-gray-900"
        }`;

    return (
        <div className="w-full min-h-svh">
            <div className="bg-gray-900/10 flex items-center flex-wrap mb-4 text-sm text-gray-900">
                <Link href="/note/yours/private" className={tabClass(currentIsPrivate)}>
                    <Lock size={18} />
                    Private
                </Link>
                <Link href="/note/yours/public" className={tabClass(!currentIsPrivate)}>
                    <Globe size={18} />
                    Public
                </Link>
            </div>
            {children}
        </div>
    );
}