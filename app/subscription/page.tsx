"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { PricingUI } from "@/components/blocks/pricing";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();
  // const [isAnnual, setIsAnnual] = useState(true);
  // const [processing, setProcessing] = useState(false);
  // const router = useRouter();

  // Mock user ID for development purposes
  // const userId = "user_" + Math.random().toString(36).substring(2, 9);

  // const handlePayment = async (planType: string, amount: number) => {
  //   try {
  //     setProcessing(true);

  //     const response = await fetch("/api/payment/phonepe", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         amount,
  //         userId,
  //         planType,
  //         planDuration: isAnnual ? "annual" : "monthly",
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.success && data.redirectUrl) {
  //       // Redirect to PhonePe payment page
  //       window.location.href = data.redirectUrl;
  //     } else {
  //       toast({
  //         title: "Payment Failed",
  //         description: data.error || "Something went wrong. Please try again.",
  //         variant: "destructive",
  //       });
  //       setProcessing(false);
  //     }
  //   } catch (_error) {
  //     //     toast({
  //       title: "Payment Error",
  //       description: "Failed to initiate payment. Please try again later.",
  //       variant: "destructive",
  //     });
  //     setProcessing(false);
  //   }
  // };
  const demoPlans = [
    {
      name: "BASIC",
      price: "500",
      yearlyPrice: "400",
      period: "per month",
      features: [
        "5 Listings ",
        "Limited AI Access",
        "Limited Property Insights",
        "Verified Property Tag",
      ],
      description: "Perfect for individuals and small projects",
      buttonText: "Get Started",
      href: "/free",
      isPopular: false,
    },
    {
      name: "PREMIUM",
      price: "1000",
      yearlyPrice: "900",
      period: "per month",
      features: [
        "5 Listings ",
        "Full AI Access",
        "Complete Property Insights",
        "Verified Property Tag",
        "Enabled HomePage features",
      ],
      description: "Ideal for growing teams and businesses",
      buttonText: "Get Started",
      href: "/free",
      isPopular: true,
    },
    {
      name: "OWNER PRO",
      price: "2000",
      yearlyPrice: "1800",
      period: "per month",
      features: [
        "5 Listings",
        "Full AI Access",
        "Complete Property Insights",
        "Verified Property Tag",
        "Enabled HomePage features",
        "360 Virtual Tour",
      ],
      description: "For large organizations with specific needs",
      buttonText: "Contact Sales",
      href: "/contact",
      isPopular: false,
    },
  ];
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroGeometric
        badge="Exclusive Membership"
        title1="Choose Your"
        title2="Premium Plan"
      />
      <PricingUI
        plans={demoPlans}
        title="Simple, Transparent Pricing"
        description="Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
      />
      {/* Hero Section */}

      {/* Feature Comparison Table */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <pattern
              id="pattern-circles-2"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <circle
                id="pattern-circle-2"
                cx="10"
                cy="10"
                r="1.6257413380501518"
                fill="#FF6600"
              ></circle>
            </pattern>
            <rect
              id="rect-2"
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#pattern-circles-2)"
            ></rect>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-500/20 px-6 py-3 rounded-full mb-6"
            >
              <span className="text-white font-medium tracking-wide">
                DETAILED COMPARISON
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Free vs Premium Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 max-w-3xl mx-auto"
            >
              See how our premium plans enhance your real estate experience with
              exclusive features and benefits
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-orange-500/20"
          >
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-6 text-left text-white text-lg font-bold bg-black/50 w-1/3">
                      Features
                    </th>
                    <th className="p-6 text-center text-white text-lg font-medium bg-black/50 w-1/3">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">Free</span>
                        <span className="text-gray-400 mt-1">Basic Access</span>
                      </div>
                    </th>
                    <th className="p-6 text-center text-white text-lg font-medium bg-orange-500/10 w-1/3">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-orange-500">
                          Premium
                        </span>
                        <span className="text-gray-400 mt-1">
                          Unlimited Access
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-black/30 font-medium">
                    <td colSpan={3} className="px-6 py-4 text-white">
                      Property Access
                    </td>
                  </tr>
                  {[
                    {
                      feature: "Property Listings",
                      free: "Basic search only",
                      premium: "Advanced filters & exclusive premium listings",
                    },
                    {
                      feature: "Virtual Tours",
                      free: "Limited access (5 per month)",
                      premium: "Unlimited access to all properties",
                    },
                    {
                      feature: "Premium Properties",
                      free: "View only (no contact)",
                      premium: "Full access with direct contact",
                    },
                    {
                      feature: "Upcoming Pre-Launch Properties",
                      free: "Not available",
                      premium: "Priority access",
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-black/20" : "bg-black/10"
                      }
                    >
                      <td className="p-5 text-left font-medium text-white">
                        {row.feature}
                      </td>
                      <td className="p-5 text-center text-gray-300">
                        {row.free === "Not available" ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="p-5 text-center text-gray-300 bg-orange-500/5">
                        {row.premium === "Priority access" ||
                        row.premium === "Full access with direct contact" ||
                        row.premium === "Unlimited access to all properties" ? (
                          <div className="flex justify-center items-center font-medium text-orange-500">
                            <Check className="w-5 h-5 text-green-500 mr-2" />
                            {row.premium}
                          </div>
                        ) : (
                          <div className="font-medium text-orange-500">
                            {row.premium}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-black/30 font-medium">
                    <td colSpan={3} className="px-6 py-4 text-white">
                      AI & Personalization
                    </td>
                  </tr>
                  {[
                    {
                      feature: "AI Property Recommendations",
                      free: "Basic recommendations",
                      premium: "Advanced AI-powered personalized matches",
                    },
                    {
                      feature: "Property Price Prediction",
                      free: "Limited accuracy",
                      premium: "Enhanced prediction with historical data",
                    },
                    {
                      feature: "Neighborhood Analysis",
                      free: "Basic information",
                      premium:
                        "Comprehensive analysis with safety scores, investment potential",
                    },
                    {
                      feature: "Smart Home Integration Advice",
                      free: "Not available",
                      premium: "Personalized integration plans",
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-black/20" : "bg-black/10"
                      }
                    >
                      <td className="p-5 text-left font-medium text-white">
                        {row.feature}
                      </td>
                      <td className="p-5 text-center text-gray-300">
                        {row.free === "Not available" ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="p-5 text-center text-gray-300 bg-orange-500/5">
                        <div className="font-medium text-orange-500">
                          {row.premium}
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-black/30 font-medium">
                    <td colSpan={3} className="px-6 py-4 text-white">
                      User Experience
                    </td>
                  </tr>
                  {[
                    {
                      feature: "Saved Favorites",
                      free: "Up to 5 properties",
                      premium: "Unlimited favorites",
                    },
                    {
                      feature: "Property Comparison",
                      free: "Compare up to 2 properties",
                      premium: "Compare unlimited properties",
                    },
                    {
                      feature: "Email Alerts",
                      free: "Weekly updates",
                      premium: "Real-time notifications",
                    },
                    {
                      feature: "Property History",
                      free: "Limited access",
                      premium: "Complete property history & ownership records",
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-black/20" : "bg-black/10"
                      }
                    >
                      <td className="p-5 text-left font-medium text-white">
                        {row.feature}
                      </td>
                      <td className="p-5 text-center text-gray-300">
                        {row.free}
                      </td>
                      <td className="p-5 text-center text-gray-300 bg-orange-500/5">
                        <div className="font-medium text-orange-500">
                          {row.premium}
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-black/30 font-medium">
                    <td colSpan={3} className="px-6 py-4 text-white">
                      Agent & Builder Access
                    </td>
                  </tr>
                  {[
                    {
                      feature: "Contact Agents",
                      free: "Limited inquiries (3/month)",
                      premium: "Unlimited direct contact",
                    },
                    {
                      feature: "Agent Response Time",
                      free: "Standard (48 hours)",
                      premium: "Priority response (24 hours)",
                    },
                    {
                      feature: "Builder Reviews",
                      free: "Read only",
                      premium: "Write reviews & see detailed ratings",
                    },
                    {
                      feature: "Direct Builder Contact",
                      free: "Not available",
                      premium: "Priority access to builder representatives",
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-black/20" : "bg-black/10"
                      }
                    >
                      <td className="p-5 text-left font-medium text-white">
                        {row.feature}
                      </td>
                      <td className="p-5 text-center text-gray-300">
                        {row.free === "Not available" ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="p-5 text-center text-gray-300 bg-orange-500/5">
                        <div className="font-medium text-orange-500">
                          {row.premium}
                        </div>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-black/30 font-medium">
                    <td colSpan={3} className="px-6 py-4 text-white">
                      Tools & Resources
                    </td>
                  </tr>
                  {[
                    {
                      feature: "EMI Calculator",
                      free: "Basic calculator",
                      premium: "Advanced calculator with multiple scenarios",
                    },
                    {
                      feature: "Document Analysis",
                      free: "Not available",
                      premium: "AI-powered legal document review",
                    },
                    {
                      feature: "Investment Analysis",
                      free: "Basic ROI calculator",
                      premium: "Comprehensive investment analytics",
                    },
                    {
                      feature: "Customer Support",
                      free: "Email support (48hr response)",
                      premium: "24/7 priority phone & chat support",
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-black/20" : "bg-black/10"
                      }
                    >
                      <td className="p-5 text-left font-medium text-white">
                        {row.feature}
                      </td>
                      <td className="p-5 text-center text-gray-300">
                        {row.free === "Not available" ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="p-5 text-center text-gray-300 bg-orange-500/5">
                        <div className="font-medium text-orange-500">
                          {row.premium}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-gradient-to-r from-orange-500 to-orange-600 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Unlock Premium Features?
              </h3>
              <p className="text-white/90 max-w-2xl mx-auto mb-6">
                Join thousands of satisfied users who&apos;ve upgraded to premium for
                an enhanced real estate experience
              </p>
              <button className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center mx-auto" onClick={() => router.push("/free")}>
                <span>Upgrade Now</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <circle
                id="pattern-circle"
                cx="10"
                cy="10"
                r="1.6257413380501518"
                fill="#FF6600"
              ></circle>
            </pattern>
            <rect
              id="rect"
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#pattern-circles)"
            ></rect>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-500/20 px-6 py-3 rounded-full mb-6"
            >
              <span className="text-white font-medium tracking-wide">
                ADDITIONAL BENEFITS
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Premium Features for All Members
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                ),
                title: "Verified Listings",
                description:
                  "All properties undergo rigorous verification to ensure authenticity and quality.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                ),
                title: "Expert Support",
                description:
                  "Access to our team of experienced real estate professionals.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "24/7 Assistance",
                description:
                  "Round-the-clock support for all your real estate queries.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/50 backdrop-blur-md rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-orange-500/20 group hover:border-orange-500/40"
              >
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <circle
                id="pattern-circle"
                cx="10"
                cy="10"
                r="1.6257413380501518"
                fill="#FF6600"
              ></circle>
            </pattern>
            <rect
              id="rect"
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#pattern-circles)"
            ></rect>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-12 shadow-xl relative overflow-hidden border border-orange-500/30"
          >
            <div className="absolute -right-16 -bottom-16 w-64 h-64 opacity-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full text-white"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                Ready to Elevate Your Real Estate Experience?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto text-center">
                Choose the plan that fits your needs and let us guide you
                through your real estate journey with ease and expertise.
              </p>
              <div className="text-center">
                <a
                  href="/subscription"
                  className="inline-block px-8 py-4 bg-white text-orange-500 font-semibold rounded-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
