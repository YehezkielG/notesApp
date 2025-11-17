"use client";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";


export default function Navbar() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="flex justify-between py-5">
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="Notes App Logo" width={25} height={25} />
        <h1 className="font-bold text-xl">vibeNote</h1>
      </div>
      <div className="relative flex items-center">
        {status === "loading" ? null : session ? (
          <div ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="focus:outline-none"
            >
              <Image
                src={session.user?.image || "/default-profile.png"}
                className="rounded-full border-2 cursor-pointer"
                alt="Profile Picture"
                width={40}
                height={40}
              />
            </button>
            {showDropdown && (
              <div
                className="absolute right-0 rounded-lg bg-white border shadow-lg z-10 p-3 py-5 "
              >
                <div className="flex items-center justify-center">
                <Image
                src={session.user?.image || "/default-profile.png"}
                className="rounded-full border-2"
                alt="Profile Picture"
                width={50}
                height={50}
              />
                </div>
                  <div
                    className="px-4 py-2 border-b mb-2 mx-2 text-center"
                    style={{
                      width: `${Math.max((session.user?.displayName?.length || 4) * 17, 160)}px`
                    }}
                  >
                    <p className="font-semibold text-gray-700">Hello, {session.user?.displayName || "User"}</p>
                  </div>
                <Link
                  href="/profile"
                  className="block  hover:bg-gray-100 p-2"
                  onClick={() => setShowDropdown(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    signOut();
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            href={"/auth"}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
