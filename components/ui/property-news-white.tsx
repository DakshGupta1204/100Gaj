"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Define type for news articles
type NewsArticle = {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
  };
};

// Define pagination settings
type PaginationSettings = {
  articlesPerPage: number;
  currentPage: number;
  totalPages: number;
};

// Add a function to get a fallback image URL
const getFallbackImage = (index: number) => {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80"
  ];
  return fallbackImages[index % fallbackImages.length];
};

export function PropertyNewsWhiteSection() {
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationSettings>({
    articlesPerPage: 4,
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch all property news at once
  const fetchAllPropertyNews = async () => {
    try {
      setIsLoading(true);

      // First, generate fallback content immediately to prevent errors
      const generateFallbackArticles = (count: number = 40) => {
        const topics = [
          "Housing Market Trends",
          "Tax Benefits for Home Buyers", 
          "Smart Home Technology",
          "Commercial Real Estate",
          "Sustainable Housing",
          "Luxury Properties",
          "Rental Market Analysis",
          "Property Investment",
          "Real Estate Technology",
          "Urban Development",
        ];

        const fallbackArticles: NewsArticle[] = Array(count)
          .fill(0)
          .map((_, index) => {
            const topicIndex = index % topics.length;
            return {
              title: `${topics[topicIndex]}: Latest Updates ${index + 1}`,
              description: `The latest trends and insights about ${topics[topicIndex].toLowerCase()} in the real estate market. Stay informed with our comprehensive analysis.`,
              url: "#",
              image: getFallbackImage(index),
              publishedAt: new Date(
                Date.now() - index * 86400000,
              ).toISOString(),
              source: {
                name:
                  index % 2 === 0 ? "Property Insights" : "Real Estate Daily",
              },
            };
          });

        setAllArticles(fallbackArticles);

        // Calculate total pages
        const totalPages = Math.ceil(
          fallbackArticles.length / pagination.articlesPerPage,
        );

        // Update pagination settings
        setPagination((prev) => ({
          ...prev,
          totalPages: totalPages,
        }));

        // Set first page of articles for display
        updateDisplayedArticles(
          fallbackArticles,
          1,
          pagination.articlesPerPage,
        );
      };

      // Load fallback data first
      generateFallbackArticles(40);
      setIsLoading(false);

      // Optionally try to enhance with real data (silently)
      try {
        const query = `"real estate" AND India`;
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&country=in&lang=en&max=100&sortby=publishedAt&apikey=ee109d074f15362d67dd776ff2b449e8`,
          { signal: AbortSignal.timeout(5000) } // 5 second timeout
        );

        if (response.ok) {
          const data = await response.json();
          if (data.articles && Array.isArray(data.articles)) {
            // Enhance with real data if available
            const articles = data.articles;
            setAllArticles(articles);

            const totalPages = Math.ceil(
              articles.length / pagination.articlesPerPage,
            );

            setPagination((prev) => ({
              ...prev,
              totalPages: totalPages,
            }));

            updateDisplayedArticles(articles, 1, pagination.articlesPerPage);
          }
        }
      } catch {
        // Silently fail - fallback data is already loaded
      }

    } catch {
      setError("Using sample property news");
      setIsLoading(false);
    }
  };

  // Helper function to update displayed articles based on page number
  const updateDisplayedArticles = (
    allArticles: NewsArticle[],
    page: number,
    articlesPerPage: number,
  ) => {
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = allArticles.slice(startIndex, endIndex);
    setDisplayedArticles(articlesToShow);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;

    setPagination((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));

    updateDisplayedArticles(
      allArticles,
      pageNumber,
      pagination.articlesPerPage,
    );

    // Scroll to top of the articles section
    document
      .getElementById("news-articles")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    fetchAllPropertyNews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading && !displayedArticles.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="text-center text-orange-500 mb-8">{error}</div>}

      <div
        id="news-articles"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {displayedArticles.map((article, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-black/10 hover:border-orange-500/30 group"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // If image fails to load, replace with fallback
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = getFallbackImage(index);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs bg-black/50 px-2 py-1 rounded">
                    {article.source?.name || "Property News"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-orange-500">
                    {article.source?.name || "Property News"}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {article.description}
                </p>
              </div>
              <div className="px-5 pb-5 pt-2">
                <div className="flex items-center text-orange-500 text-sm font-medium">
                  Read Article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5-5 5M5 7l5 5-5 5"
                    />
                  </svg>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="flex flex-wrap justify-center items-center gap-2">
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-3 py-2 border border-orange-500/30 text-orange-500 font-medium rounded-md hover:bg-orange-500/10 transition-all duration-300 ${
              pagination.currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page number buttons */}
          {Array.from(
            { length: Math.min(pagination.totalPages, 5) },
            (_, i) => {
              // Logic to show pages around current page
              let pageToShow;
              if (pagination.totalPages <= 5) {
                // If we have 5 or fewer pages, show all pages
                pageToShow = i + 1;
              } else if (pagination.currentPage <= 3) {
                // If we're on pages 1-3, show pages 1-5
                pageToShow = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                // If we're on the last 3 pages, show the last 5 pages
                pageToShow = pagination.totalPages - 4 + i;
              } else {
                // Otherwise show 2 pages before and after current page
                pageToShow = pagination.currentPage - 2 + i;
              }

              return (
                <button
                  key={pageToShow}
                  onClick={() => handlePageChange(pageToShow)}
                  className={`w-10 h-10 rounded-md font-medium transition-all duration-300 ${
                    pagination.currentPage === pageToShow
                      ? "bg-orange-500 text-white"
                      : "border border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                  }`}
                >
                  {pageToShow}
                </button>
              );
            },
          )}

          {/* Show ellipsis if there are more pages */}
          {pagination.totalPages > 5 &&
            pagination.currentPage < pagination.totalPages - 2 && (
              <span className="text-orange-500 px-1">...</span>
            )}

          {/* Show last page if not visible in the current range */}
          {pagination.totalPages > 5 &&
            pagination.currentPage < pagination.totalPages - 2 && (
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                className="w-10 h-10 rounded-md font-medium border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
              >
                {pagination.totalPages}
              </button>
            )}

          {/* Next page button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-3 py-2 border border-orange-500/30 text-orange-500 font-medium rounded-md hover:bg-orange-500/10 transition-all duration-300 ${
              pagination.currentPage === pagination.totalPages
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="text-gray-500 text-sm mt-4">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </motion.div>
    </div>
  );
}
