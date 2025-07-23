"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBuilding, FaArrowRight, FaSearch, FaFilter, FaTimes, } from "react-icons/fa";
import Navbar from "../components/navbar";
const ProjectsContent = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        projectType: [],
        city: [],
        projectStage: [],
        priceRange: [0, 50000000], // 50 crores max
    });
    const router = useRouter();
    const projectTypes = ["residential", "commercial", "mixed-use"];
    const projectStages = ["under-construction", "ready-to-move"];
    const cities = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"];
    // Fetch projects from API
    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/projects");
            if (response.data.success) {
                const projectsData = response.data.projects;
                setProjects(projectsData);
                setFilteredProjects(projectsData);
            }
            else {
                toast.error("Failed to fetch projects");
                setProjects([]);
                setFilteredProjects([]);
            }
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
            setProjects([]);
            setFilteredProjects([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Filter projects based on search and filters
    const filterProjects = () => {
        let filtered = projects;
        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((project) => project.projectName.toLowerCase().includes(query) ||
                project.city.toLowerCase().includes(query) ||
                project.locality.toLowerCase().includes(query) ||
                project.projectType.toLowerCase().includes(query) ||
                project.developerDescription.toLowerCase().includes(query));
        }
        // Project type filter
        if (selectedFilters.projectType.length > 0) {
            filtered = filtered.filter((project) => selectedFilters.projectType.includes(project.projectType));
        }
        // City filter
        if (selectedFilters.city.length > 0) {
            filtered = filtered.filter((project) => selectedFilters.city.some((city) => project.city.toLowerCase().includes(city.toLowerCase())));
        }
        // Project stage filter
        if (selectedFilters.projectStage.length > 0) {
            filtered = filtered.filter((project) => selectedFilters.projectStage.includes(project.projectStage));
        }
        // Price range filter
        filtered = filtered.filter((project) => {
            const minPrice = Math.min(...project.unitTypes.map((u) => u.priceRange.min));
            const maxPrice = Math.max(...project.unitTypes.map((u) => u.priceRange.max));
            return (minPrice >= selectedFilters.priceRange[0] &&
                maxPrice <= selectedFilters.priceRange[1]);
        });
        setFilteredProjects(filtered);
    };
    const handleFilterChange = (filterType, value) => {
        setSelectedFilters((prev) => (Object.assign(Object.assign({}, prev), { [filterType]: value })));
    };
    const resetFilters = () => {
        setSelectedFilters({
            projectType: [],
            city: [],
            projectStage: [],
            priceRange: [0, 50000000],
        });
        setSearchQuery("");
    };
    const handleSearch = (e) => {
        e.preventDefault();
        filterProjects();
    };
    // Format price for display
    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(1)} Cr`;
        }
        else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(1)} L`;
        }
        return `₹${price.toLocaleString()}`;
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    useEffect(() => {
        filterProjects();
    }, [searchQuery, selectedFilters, projects]);
    return (<div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore Projects
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            Discover the latest residential and commercial projects from verified developers
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects, location, developer..." className="w-full pl-4 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"/>
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <FaSearch className="h-4 w-4 text-gray-400"/>
                </button>
              </div>
            </form>

            {/* Filter Button */}
            <button onClick={() => setShowFilters(true)} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2">
              <FaFilter className="h-4 w-4"/>
              Filters
            </button>

            {/* Results Count */}
            <div className="text-sm text-gray-400">
              <span className="font-medium text-orange-500">
                {filteredProjects.length}
              </span>{" "}
              projects found
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (<div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>) : filteredProjects.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (<motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image src={project.projectImages && project.projectImages.length > 0
                    ? project.projectImages[0]
                    : "/placeholder-project.jpg"} alt={project.projectName} fill className="object-cover"/>
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                      {project.projectStage === "under-construction"
                    ? "Under Construction"
                    : "Ready to Move"}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-600/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium capitalize">
                      {project.projectType}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {project.projectName}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {project.projectTagline}
                  </p>

                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2 text-orange-400"/>
                    {project.locality}, {project.city}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Units Available:</span>
                      <span className="text-white">
                        {project.unitTypes.map((unit) => unit.type).join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Price Range:</span>
                      <span className="text-orange-500 font-medium">
                        {formatPrice(Math.min(...project.unitTypes.map((u) => u.priceRange.min)))} - {formatPrice(Math.max(...project.unitTypes.map((u) => u.priceRange.max)))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Possession:</span>
                      <span className="text-white">
                        {new Date(project.possessionDate).getFullYear()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <FaBuilding className="h-3 w-3 mr-1"/>
                      RERA: {project.reraRegistrationNo}
                    </div>
                    
                    <Link href={`/projects/${project._id}`} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm">
                      View Details
                      <FaArrowRight className="h-3 w-3"/>
                    </Link>
                  </div>
                </div>
              </motion.div>))}
          </div>) : (<div className="text-center py-20">
            <FaSearch className="h-16 w-16 mx-auto text-gray-600 mb-4"/>
            <h3 className="text-xl font-medium text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button onClick={resetFilters} className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              Reset Filters
            </button>
          </div>)}
      </div>

      {/* Filter Modal */}
      {showFilters && (<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                  <FaTimes className="h-5 w-5"/>
                </button>
              </div>

              {/* Project Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">Project Type</h3>
                <div className="space-y-2">
                  {projectTypes.map((type) => (<label key={type} className="flex items-center">
                      <input type="checkbox" checked={selectedFilters.projectType.includes(type)} onChange={(e) => {
                    const newTypes = e.target.checked
                        ? [...selectedFilters.projectType, type]
                        : selectedFilters.projectType.filter((t) => t !== type);
                    handleFilterChange("projectType", newTypes);
                }} className="mr-3 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"/>
                      <span className="text-gray-300 capitalize">{type.replace("-", " ")}</span>
                    </label>))}
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">City</h3>
                <div className="space-y-2">
                  {cities.map((city) => (<label key={city} className="flex items-center">
                      <input type="checkbox" checked={selectedFilters.city.includes(city)} onChange={(e) => {
                    const newCities = e.target.checked
                        ? [...selectedFilters.city, city]
                        : selectedFilters.city.filter((c) => c !== city);
                    handleFilterChange("city", newCities);
                }} className="mr-3 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"/>
                      <span className="text-gray-300">{city}</span>
                    </label>))}
                </div>
              </div>

              {/* Project Stage Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3">Project Stage</h3>
                <div className="space-y-2">
                  {projectStages.map((stage) => (<label key={stage} className="flex items-center">
                      <input type="checkbox" checked={selectedFilters.projectStage.includes(stage)} onChange={(e) => {
                    const newStages = e.target.checked
                        ? [...selectedFilters.projectStage, stage]
                        : selectedFilters.projectStage.filter((s) => s !== stage);
                    handleFilterChange("projectStage", newStages);
                }} className="mr-3 rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"/>
                      <span className="text-gray-300 capitalize">
                        {stage.replace("-", " ")}
                      </span>
                    </label>))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button onClick={resetFilters} className="flex-1 py-3 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                  Reset
                </button>
                <button onClick={() => setShowFilters(false)} className="flex-1 py-3 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
};
export default ProjectsContent;
