"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-orange-500/5 rounded-full -ml-48 -mb-48"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <Image src="/logo.png" alt="100 Gaj Logo" width={50} height={50} />
              <h3 className="text-2xl font-bold text-white ml-4">100 GAJ</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              Your trusted partner in finding the perfect property that matches
              your dreams and aspirations. We specialize in luxury real estate
              for those who demand excellence.
            </p>
            <div className="flex space-x-5">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-beige/10 flex items-center justify-center text-stone hover:text-orange-400 hover:bg-orange-600/20 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/100.gaj?igsh=MTMzMGY3YmYzZjVocg=="
                className="h-10 w-10 rounded-full bg-beige/10 flex items-center justify-center text-stone hover:text-orange-400 hover:bg-orange-600/20 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/100-gaj/"
                className="h-10 w-10 rounded-full bg-beige/10 flex items-center justify-center text-stone hover:text-orange-400 hover:bg-orange-600/20 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-beige mb-5">
              Properties
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search?location=Dwarka"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Dwarka
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Saket"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Saket
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Lutyens'+Delhi"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Lutyens&apos; Delhi
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Defence+Colony"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Defence Colony
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Vasant+Kunj,"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Vasant Kunj
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Hauz+Khas"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Hauz Khas
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Greater+Kailash"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Greater Kailash
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Model+Town"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Model Town
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Pandav+Nagar"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Properties in Pandav Nagar
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-beige mb-5">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Our Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/builders"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Our builders
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-beige mb-5">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="hover:text-beige transition-all duration-300 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-beige mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-beige-dark group-hover:text-beige transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="group-hover:text-beige transition-all duration-300">
                  S.No. 123, IT Park, Hinjewadi Phase 1,
                  <br />
                  Pune, Maharashtra 411057
                  <br />
                  India
                </span>
              </li>
              <li className="flex items-start group">
                <a href="mailto:contact@100gaj.com" className="flex items-start group w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-beige-dark group-hover:text-beige transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l9 6 9-6M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
                  />
                </svg>

                <span className="w-full group-hover:text-beige transition-all duration-300 break-words whitespace-normal">
                  contact@100gaj.com
                </span>
                </a>
              </li>
              <li className="flex items-start group">
                <a href="tel:+919876543210" className="flex items-start group w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-beige-dark group-hover:text-beige transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="group-hover:text-beige transition-all duration-300">
                  +91 98765 43210
                </span>
                </a>
              </li>
              <li className="flex items-start group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-beige-dark group-hover:text-beige transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="group-hover:text-beige transition-all duration-300">
                  Mon - Sat: 9:00 AM - 7:00 PM
                  <br />
                  Sunday: 10:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brown/20 mt-16 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-stone/80">
              &copy; {new Date().getFullYear()} 100 Gaj. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
