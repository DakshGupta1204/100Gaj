"use client";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";
export default function NotFound() {
    return (<ClientOnly>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Go Home
        </Link>
      </div>
    </ClientOnly>);
}
