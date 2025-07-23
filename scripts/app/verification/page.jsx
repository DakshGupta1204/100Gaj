"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VerificationRequestForm from "@/components/blocks/VerificationRequestForm";
import { toast } from "sonner";
import Navbar from "../components/navbar";
export default function VerificationPage() {
    const { status } = useSession();
    const [token, setToken] = useState(null);
    const router = useRouter();
    useEffect(() => {
        // Only run this on the client side
        if (typeof window !== "undefined") {
            const authToken = sessionStorage.getItem("authToken");
            if (authToken) {
                setToken(authToken);
            }
            else {
                toast.error("Please login to proceed!! Redirecting to home page!");
                setTimeout(() => {
                    router.push("/?modal=auth");
                }, 1000);
            }
        }
    }, []);
    if (status === "loading") {
        return (<div className="flex items-center justify-center h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>);
    }
    return (<div className="container mx-auto py-8 sm:py-12 px-3 sm:px-4 bg-gradient-to-r from-black via-gray-900 to-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto relative mt-16">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg width="300" height="300" viewBox="0 0 400 400" fill="none" className="sm:w-[400px] sm:h-[400px]" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="url(#grad1)" strokeWidth="4"/>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#FFA500", stopOpacity: 0.2 }}/>
                  <stop offset="100%" style={{ stopColor: "#FF4500", stopOpacity: 0.2 }}/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-orange-500">
            Get Verified on 100Gaj
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mb-4 sm:mb-6 px-1">
            Become a verified Agent or Builder to enhance your credibility and
            gain more visibility on our platform.
          </p>
        </div>

        <div className="mb-8 sm:mb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 text-orange-500">
                Benefits for Agents
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Enhanced visibility in search results
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Verified badge on your profile
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    More inquiries from serious buyers
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Higher trust factor with clients
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 text-orange-500">
                Benefits for Builders
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Featured in the builders directory
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Showcase your projects to potential customers
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Establish credibility and trust
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-sm sm:text-base">
                    Direct inquiries from interested buyers
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <VerificationRequestForm />

        <div className="mt-8 sm:mt-12 bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg relative z-10">
          <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-orange-500">
            Verification Process
          </h3>
          <ol className="space-y-3 sm:space-y-4">
            <li className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <span className="font-medium text-orange-500">1</span>
              </div>
              <div>
                <h4 className="font-medium text-orange-500 text-sm sm:text-base">
                  Submit your request
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Fill out the form with your professional details.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <span className="font-medium text-orange-500">2</span>
              </div>
              <div>
                <h4 className="font-medium text-orange-500 text-sm sm:text-base">
                  Verification review
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Our team will review your application (typically within 1-2
                  business days).
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <span className="font-medium text-orange-500">3</span>
              </div>
              <div>
                <h4 className="font-medium text-orange-500 text-sm sm:text-base">
                  Get verified
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Once approved, you&apos;ll receive a verification badge and
                  enhanced features.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>);
}
