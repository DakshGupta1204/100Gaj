import Image from "next/image";
import Link from "next/link";

export default function EquityFooter() {
  return (
    <footer className="bg-black text-white relative border-t border-[#a78bfa]/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#a78bfa]/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-[#B6FF3F]/10 rounded-full -ml-48 -mb-48"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Section */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <Image src="/logo.png" alt="100 Gaj Logo" width={50} height={50} />
              <h3 className="text-2xl font-bold text-[#a78bfa] ml-4">100Gaj Equity</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              Invest in premium commercial real estate with ease. Build your wealth, diversify your portfolio, and earn monthly income with 100Gaj Equity Platform.
            </p>
            <div className="flex space-x-5">
              {/* Instagram */}
              <a href="https://www.instagram.com/100.gaj" className="h-10 w-10 rounded-full bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] hover:text-[#B6FF3F] hover:bg-[#B6FF3F]/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/100-gaj/" className="h-10 w-10 rounded-full bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] hover:text-[#B6FF3F] hover:bg-[#B6FF3F]/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v14H0V8zm7.5 0h4.667v1.924h.065c.65-1.188 2.237-2.448 4.605-2.448 4.927 0 5.833 3.252 5.833 7.483V22H17v-6.446c0-1.537-.028-3.516-2.145-3.516-2.148 0-2.477 1.676-2.477 3.406V22H7.5V8z" />
                </svg>
              </a>

            </div>
          </div>

          {/* Spacer for Larger Gap */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/equity" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Dashboard</Link></li>
              <li><Link href="/equity/property" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Properties</Link></li>
              <li><Link href="/equity/portfolio" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Portfolio</Link></li>
              <li><Link href="/equity/analytics" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Analytics</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/equity/contact" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Contact Us</Link></li>
              <li><Link href="/equity/faq" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">FAQ</Link></li>
              <li><Link href="/equity/legal" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Privacy Policy</Link></li>
              <li><Link href="/equity/legal" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-white">

              {/* Address */}
              <li className="flex items-start group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1 mr-2 text-[#B6FF3F] group-hover:text-[#a78bfa] transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="group-hover:text-[#B6FF3F] transition-all duration-300">
                  S.No. 123, IT Park,<br />
                  Hinjewadi Phase 1,<br />
                  Pune, Maharashtra 411057<br />
                  India
                </span>
              </li>

              {/* Email */}
              <li className="flex items-center group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#B6FF3F] group-hover:text-[#a78bfa] transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 7 8-7"
                  />
                </svg>
                 <a
        href="mailto:info@100gaj.com"
        className="group-hover:text-[#B6FF3F] transition-all duration-300"
      >
        contact@100gaj.com
      </a>
              </li>

              {/* Phone */}
              <li className="flex items-center group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#B6FF3F] group-hover:text-[#a78bfa] transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.5l.49 2.1a2 2 0 01-.45 1.82L8.1 10.9a11.05 11.05 0 005 5l2.48-1.16a2 2 0 011.82.45l2.1.49a2 2 0 011.5 1.94V19a2 2 0 01-2 2h-.5C9.16 21 3 14.84 3 7.5V7a2 2 0 012-2z"
                  />
                </svg>
                <a href="tel:+919876543210" className="group-hover:text-[#B6FF3F] transition-all duration-300">
                  +91 98765 43210
                </a>
              </li>

              {/* Working Hours */}
              <li className="flex items-start group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1 mr-2 text-[#B6FF3F] group-hover:text-[#a78bfa] transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="group-hover:text-[#B6FF3F] transition-all duration-300">
                  Mon – Sat: 9:00 AM – 7:00 PM<br />
                  Sunday: 10:00 AM – 5:00 PM
                </span>
              </li>
            </ul>
          </div>


        </div>

        <div className="mt-12 border-t border-[#a78bfa]/20 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} 100Gaj Equity Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
