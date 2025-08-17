"use client";
import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaFilter,
  FaTimes,
  FaHeart,
  FaMapMarkerAlt,
  FaArrowRight,
  FaMap,
  FaList,
  FaNewspaper,
  FaRuler,
  FaBuilding,
  FaClock,
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { FavoritesAPI } from "../lib/api-helpers";
import { useFavorites } from "../contexts/FavoritesContext";
import Map from "../components/Map";


// Mock property data
const priceRanges = [
  { label: "Any Price", value: [0, 100000000] },
  { label: "Under ₹20 Lakh", value: [0, 2000000] },
  { label: "₹20 Lakh - ₹50 Lakh", value: [2000000, 5000000] },
  { label: "₹50 Lakh - ₹1 Crore", value: [5000000, 10000000] },
  { label: "₹1 Crore - ₹2 Crore", value: [10000000, 20000000] },
  { label: "Above ₹2 Crore", value: [20000000, 100000000] },
];

const areaRanges = [
  { label: "Any Size", value: [0, 10000] },
  { label: "Under 500 sqft", value: [0, 500] },
  { label: "500 - 1000 sqft", value: [500, 1000] },
  { label: "1000 - 2000 sqft", value: [1000, 2000] },
  { label: "2000 - 3000 sqft", value: [2000, 3000] },
  { label: "Above 3000 sqft", value: [3000, 10000] },
];

const mockProperties: Property[] = [
  {
    _id: "1",
    title: "Luxury Penthouse with City View",
    location: "Rohini, New Delhi",
    address: {
      street: "123 Main St",
      city: "Rohini",
      state: "Delhi",
      zipCode: "110085",
      location: {
        type: "Point",
        coordinates: [77.1025, 28.7041],
      },
    },
    price: 2500000,
    propertyType: "Apartment",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 2500,
    images: ["/canada.jpeg"],
    tags: ["Luxury", "City View", "Penthouse"],
  },
  {
    _id: "2",
    title: "Modern Villa with Pool",
    location: "Dwarka, New Delhi",
    address: {
      street: "456 Garden St",
      city: "Dwarka",
      state: "Delhi",
      zipCode: "110075",
      location: {
        type: "Point",
        coordinates: [77.0469, 28.5921],
      },
    },
    price: 4200000,
    propertyType: "Villa",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 4800,
    images: ["/airpirt.jpeg"],
    tags: ["Luxury", "Pool", "Modern"],
  },
  {
    _id: "3",
    title: "Waterfront Condo",
    location: "East Delhi",
    address: {
      street: "789 River Side",
      city: "Laxmi Nagar",
      state: "Delhi",
      zipCode: "110092",
      location: {
        type: "Point",
        coordinates: [77.2773, 28.6363],
      },
    },
    price: 1800000,
    propertyType: "Condo",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    images: ["/dwarka.jpeg"],
    tags: ["Waterfront", "Beach", "Modern"],
  },
  {
    _id: "4",
    title: "Historic Townhouse",
    location: "Vasant Vihar, New Delhi",
    address: {
      street: "321 Heritage Lane",
      city: "Vasant Vihar",
      state: "Delhi",
      zipCode: "110057",
      location: {
        type: "Point",
        coordinates: [77.1525, 28.5677],
      },
    },
    price: 1950000,
    propertyType: "Townhouse",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: ["/image1.jpg"],
    tags: ["Historic", "Renovated", "Central"],
  },
  {
    _id: "5",
    title: "Luxury Apartment for Rent",
    location: "South Delhi",
    address: {
      street: "567 Premium Heights",
      city: "Greater Kailash",
      state: "Delhi",
      zipCode: "110048",
      location: {
        type: "Point",
        coordinates: [77.2424, 28.5244],
      },
    },
    price: 8500,
    propertyType: "Apartment",
    listingType: "rent",
    status: "For Rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    images: ["/image2.avif"],
    tags: ["Luxury", "Furnished", "Doorman"],
  },
  {
    _id: "6",
    title: "Modern Office Space",
    location: "Gurgaon",
    address: {
      street: "890 Business Hub",
      city: "Gurgaon",
      state: "Haryana",
      zipCode: "122001",
      location: {
        type: "Point",
        coordinates: [77.0266, 28.4595],
      },
    },
    price: 3200000,
    propertyType: "Commercial",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 0,
    bathrooms: 2,
    area: 2800,
    images: ["/image3.webp"],
    tags: ["Commercial", "Modern", "Downtown"],
  },
];

// Update the property interface to match API response
interface Property {
  _id: string;
  title: string;
  location?: string;
  address: {
    street?: string;
    city: string;
    state?: string;
    zipCode?: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  price: number;
  propertyType: string;
  listingType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  tags?: string[];
}

// Interface for projects
interface Project {
  _id: string;
  projectName: string;
  projectType: string;
  propertyTypesOffered: string[];
  projectStage: string;
  reraRegistrationNo: string;
  projectTagline: string;
  developerDescription: string;
  city: string;
  locality: string;
  projectAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  unitTypes: {
    type: string;
    sizeRange: {
      min: number;
      max: number;
      unit: string;
    };
    priceRange: {
      min: number;
      max: number;
      perSqft?: number;
    };
  }[];
  possessionDate: string;
  constructionStatus: string;
  projectImages: string[];
  developer: any;
  developerContact: {
    name: string;
    phone: string;
    email: string;
  };
  status: string;
  verified: boolean;
  views: number;
  favorites: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
}

// Combined interface for search results
interface SearchItem {
  _id: string;
  title: string;
  type: 'property' | 'project';
  location: string;
  coordinates: [number, number];
  price: number | string;
  area: number | string;
  images: string[];
  propertyType?: string;
  projectType?: string;
  bedrooms?: number;
  bathrooms?: number;
  listingType?: string;
  status?: string;
  tags?: string[];
  // Project specific fields
  projectName?: string;
  projectStage?: string;
  constructionStatus?: string;
  unitTypes?: any[];
  possessionDate?: string;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface FilterState {
  priceRange: [number, number];
  propertyType: string[];
  status: string[];
  beds: number[];
  baths: number[];
  area: [number, number];
  mapBounds?: MapBounds;
}

// Separate interface for project filters
interface ProjectFilterState {
  priceRange: [number, number];
  projectType: string[];
  projectStage: string[];
  constructionStatus: string[];
  unitTypes: string[];
  area: [number, number];
  possessionYear: string[];
  mapBounds?: MapBounds;
}

// Interface for articles
interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string; // We'll map GNews 'image' to this field
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}
// const isServer = () => typeof window === 'undefined';

const SearchPage = () => {
  // if(isServer())return null;
  const [token, setToken] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  useEffect(() => {
    const authToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("authToken")
        : null;
    if (authToken) {
      setToken(authToken);
    }
  }, []);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterTab, setFilterTab] = useState<'properties' | 'projects'>('properties');
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('list');
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    priceRange: [0, 100000000],
    propertyType: [],
    status: [],
    beds: [],
    baths: [],
    area: [0, 10000],
  });
  const [selectedProjectFilters, setSelectedProjectFilters] = useState<ProjectFilterState>({
    priceRange: [0, 100000000],
    projectType: [],
    projectStage: [],
    constructionStatus: [],
    unitTypes: [],
    area: [0, 10000],
    possessionYear: [],
  });
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 }); // Delhi coordinates
  const [zoom, setZoom] = useState(12);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredSearchItems, setFilteredSearchItems] = useState<SearchItem[]>([]);
  const [allSearchItems, setAllSearchItems] = useState<SearchItem[]>([]);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [showingType, setShowingType] = useState<'all' | 'properties' | 'projects'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [showArticles, setShowArticles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newlyAddedProperties, setNewlyAddedProperties] = useState<Set<string>>(
    new Set(),
  );
  const router = useRouter();
  // Property types from backend - Updated to match database schema and UI dropdown requirements
  // Includes all property types: apartment, house, villa, studio, penthouse, duplex, townhouse, condo
  const propertyTypes = [
    "apartment",
    "house", 
    "villa",
    "studio",
    "penthouse",
    "duplex",
    "townhouse",
    "condo",
  ];
  
  // Project specific filter options
  const projectTypes = [
    "Residential",
    "Commercial",
    "Mixed Use",
    "Villa Project",
    "Apartment Complex",
    "Shopping Mall",
    "Office Complex",
  ];
  
  const projectStages = [
    "New Launch",
    "Pre Launch",
    "Under Construction",
    "Ready to Move",
    "Completed",
  ];
  
  const constructionStatuses = [
    "Planning",
    "Foundation",
    "Structure",
    "Finishing",
    "Completed",
  ];
  
  const unitTypeOptions = [
    "1 BHK",
    "2 BHK", 
    "3 BHK",
    "4 BHK",
    "5+ BHK",
    "Studio",
    "Penthouse",
  ];
  
  const possessionYears = [
    "2024",
    "2025",
    "2026",
    "2027",
    "2028+",
  ];
  
  const bedOptions = [1, 2, 3, 4, 5, 6];

  // Fetch initial data on component mount
  useEffect(() => {
    fetchAllData();
    const filterParam = searchParams.get("filter");
    if (filterParam === "sale") {
      setSelectedFilters((prev) => ({
        ...prev,
        status: ["sale"],
      }));
    } else if (filterParam === "rent") {
      setSelectedFilters((prev) => ({
        ...prev,
        status: ["rent"],
      }));
    }

    const propertyTypeParam = searchParams.get("propertyType");
    if (propertyTypeParam) {
      setSelectedFilters((prev) => {
        // Only add the property type if it's not already in the list
        if (!prev.propertyType.includes(propertyTypeParam)) {
          return {
            ...prev,
            propertyType: [...prev.propertyType, propertyTypeParam],
          };
        }
        return prev;
      });
    }

    const locationParam = searchParams.get("location");
    if (locationParam) {
      setSearchQuery(locationParam);
    }

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const nearMe = searchParams.get("nearMe");

    if (lat && lng && nearMe === "true") {
      // Update map center to user's location
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      setMapCenter({ lat: userLat, lng: userLng });
      setZoom(14); // Closer zoom for near me
    }
  }, [searchParams]);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      const response = await axios.get("/api/properties");

      if (response.data.success) {
        const properties = response.data.properties;

        // Store the properties in sessionStorage for quick access on refresh
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              "cachedProperties",
              JSON.stringify(properties),
            );
            sessionStorage.setItem(
              "propertiesCacheTime",
              new Date().toString(),
            );
          } catch (_e) {

          }
        }
        setAllProperties(properties);
        setFilteredProperties(properties);
        return properties;
      } else {
        // Use mock data as fallback
        setAllProperties(mockProperties);
        setFilteredProperties(mockProperties);
        return mockProperties;
      }
    } catch (_error) {

      // Try to get cached properties from sessionStorage
      if (typeof window !== "undefined") {
        try {
          const cachedProperties = sessionStorage.getItem("cachedProperties");
          if (cachedProperties) {
            const properties = JSON.parse(cachedProperties);
            setAllProperties(properties);
            setFilteredProperties(properties);
            return properties;
          }
        } catch (_e) {

        }
      }

      // Use mock data as fallback if no cache
      setAllProperties(mockProperties);
      setFilteredProperties(mockProperties);
      return mockProperties;
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects");

      if (response.data.success) {
        const projects = response.data.projects;
        
        // Store the projects in sessionStorage for quick access on refresh
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              "cachedProjects",
              JSON.stringify(projects),
            );
            sessionStorage.setItem(
              "projectsCacheTime",
              new Date().toString(),
            );
          } catch (_e) {

          }
        }
        setAllProjects(projects);
        return projects;
      } else {
        setAllProjects([]);
        return [];
      }
    } catch (_error) {

      // Try to get cached projects from sessionStorage
      if (typeof window !== "undefined") {
        try {
          const cachedProjects = sessionStorage.getItem("cachedProjects");
          if (cachedProjects) {
            const projects = JSON.parse(cachedProjects);
            setAllProjects(projects);
            return projects;
          }
        } catch (_e) {

        }
      }

      setAllProjects([]);
      return [];
    }
  };

  // Convert property to SearchItem
  const propertyToSearchItem = (property: Property): SearchItem => ({
    _id: property._id,
    title: property.title,
    type: 'property',
    location: property.location || `${property.address.city}`,
    coordinates: property.address.location.coordinates,
    price: property.price,
    area: property.area,
    images: property.images,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    listingType: property.listingType,
    status: property.status,
    tags: property.tags,
  });

  // Convert project to SearchItem
  const projectToSearchItem = (project: Project): SearchItem => {
    const minPrice = Math.min(...project.unitTypes.map(u => u.priceRange.min));
    const maxPrice = Math.max(...project.unitTypes.map(u => u.priceRange.max));
    const minArea = Math.min(...project.unitTypes.map(u => u.sizeRange.min));
    const maxArea = Math.max(...project.unitTypes.map(u => u.sizeRange.max));

    return {
      _id: project._id,
      title: project.projectName,
      type: 'project',
      location: `${project.locality}, ${project.city}`,
      coordinates: [project.coordinates.longitude, project.coordinates.latitude],
      price: minPrice * 100000, // Convert lacs to rupees for consistent filtering
      area: `${minArea}-${maxArea} sqft`,
      images: project.projectImages,
      projectType: project.projectType,
      projectName: project.projectName,
      projectStage: project.projectStage,
      constructionStatus: project.constructionStatus,
      unitTypes: project.unitTypes,
      possessionDate: project.possessionDate,
      status: project.status,
    };
  };

  // Combine and fetch all data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      const [properties, projects] = await Promise.all([
        fetchProperties(),
        fetchProjects()
      ]);

      const searchItems = [
        ...properties.map(propertyToSearchItem),
        ...projects.map(projectToSearchItem)
      ];

      setAllSearchItems(searchItems);
      setFilteredSearchItems(searchItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the searchPropertiesInMapBounds function
  const searchPropertiesInMapBounds = async () => {
    if (!mapBounds) return;

    try {
      setIsLoading(true);

      const { north, south, east, west } = mapBounds;

      // Prepare query parameters for filters
      const params: Record<string, string | number> = {
        north,
        south,
        east,
        west,
        zoom,
      };

      // Add other filters if they are set
      if (selectedFilters.propertyType.length > 0) {
        params.propertyType = selectedFilters.propertyType.join(",");
      }

      if (selectedFilters.status.includes("sale")) {
        params.listingType = "sale";
      } else if (selectedFilters.status.includes("rent")) {
        params.listingType = "rent";
      }

      if (selectedFilters.priceRange[0] > 0) {
        params.minPrice = selectedFilters.priceRange[0];
      }

      if (selectedFilters.priceRange[1] < 100000000) {
        params.maxPrice = selectedFilters.priceRange[1];
      }

      if (selectedFilters.beds.length > 0) {
        params.bedrooms = Math.min(...selectedFilters.beds);
      }

      if (selectedFilters.baths.length > 0) {
        params.bathrooms = Math.min(...selectedFilters.baths);
      }

      if (searchQuery && searchQuery.trim() !== "") {
        params.search = searchQuery.trim();
      }

      console.log('Search params:', params);

      try {
        // Try to get properties from API
        const [propertiesResponse, projectsResponse] = await Promise.all([
          axios.get("/api/properties/map-search", { params }).catch(() => null),
          axios.get("/api/projects", { params }).catch(() => null)
        ]);

        let apiProperties: Property[] = [];
        let apiProjects: Project[] = [];

        // Handle properties response
        if (propertiesResponse?.data?.properties?.length > 0) {
          apiProperties = propertiesResponse?.data.properties || [];
        }

        // Handle projects response
        if (projectsResponse?.data?.success && projectsResponse.data.projects?.length > 0) {
          apiProjects = projectsResponse.data.projects;
        }

        // If we got results from API, use them
        if (apiProperties.length > 0 || apiProjects.length > 0) {
          console.log('Using API results:', { propertiesCount: apiProperties.length, projectsCount: apiProjects.length });
          
          // Convert to search items
          const searchItems = [
            ...apiProperties.map(propertyToSearchItem),
            ...apiProjects.map(projectToSearchItem)
          ];

          // Filter by map bounds
          const itemsInBounds = searchItems.filter((item) => {
            if (!item.coordinates || item.coordinates.length !== 2) return false;

            const lat = item.coordinates[1];
            const lng = item.coordinates[0];

            return lat <= north && lat >= south && lng <= east && lng >= west;
          });

          console.log('Items in bounds from API:', itemsInBounds.length);
          setFilteredSearchItems(itemsInBounds);
          
          // Update legacy properties for backward compatibility
          const propertiesOnly = itemsInBounds.filter(item => item.type === 'property');
          const legacyProperties = propertiesOnly.map(item => {
            return allProperties.find(prop => prop._id === item._id);
          }).filter(Boolean) as Property[];
          setFilteredProperties(legacyProperties);
        } else {
          console.log('No API results, falling back to client-side filtering');
          // Fallback to client-side filtering
          fallbackToClientFiltering();
        }
      } catch (error) {
        console.error('Error in map search:', error);
        fallbackToClientFiltering();
      }
    } catch (error) {
      console.error('Error in searchPropertiesInMapBounds:', error);
      fallbackToClientFiltering();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a property matches current filters
  const isPropertyMatchingFilters = (property: Property) => {
    // Search query filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        (property.location &&
          property.location.toLowerCase().includes(query)) ||
        (property.address?.city &&
          property.address.city.toLowerCase().includes(query)) ||
        (property.address?.state &&
          property.address.state.toLowerCase().includes(query)) ||
        (property.propertyType &&
          property.propertyType.toLowerCase().includes(query)) ||
        (property.tags &&
          property.tags.some((tag) => tag.toLowerCase().includes(query)));

      if (!matchesSearch) return false;
    }

    // Property type filter
    if (
      selectedFilters.propertyType.length > 0 &&
      !selectedFilters.propertyType.some(
        (type) =>
          property.propertyType &&
          property.propertyType.toLowerCase() === type.toLowerCase(),
      )
    ) {
      return false;
    }

    // Status filter
    if (
      selectedFilters.status.length > 0 &&
      !selectedFilters.status.some((status) => property.listingType === status)
    ) {
      return false;
    }

    // Beds filter
    if (
      selectedFilters.beds.length > 0 &&
      !selectedFilters.beds.includes(property.bedrooms)
    ) {
      return false;
    }

    // Baths filter
    if (
      selectedFilters.baths.length > 0 &&
      !selectedFilters.baths.includes(property.bathrooms)
    ) {
      return false;
    }

    // Area filter
    if (
      property.area < selectedFilters.area[0] ||
      property.area > selectedFilters.area[1]
    ) {
      return false;
    }

    // Price filter
    if (
      property.price < selectedFilters.priceRange[0] ||
      property.price > selectedFilters.priceRange[1]
    ) {
      return false;
    }

    return true;
  };

  // Helper function to check if a project matches current filters
  const isProjectMatchingFilters = (item: SearchItem) => {
    if (item.type !== 'project') return false;

    // Search query filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        (item.location && item.location.toLowerCase().includes(query)) ||
        (item.projectType && item.projectType.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // Project type filter
    if (
      selectedProjectFilters.projectType.length > 0 &&
      item.projectType &&
      !selectedProjectFilters.projectType.some(
        (type) => item.projectType && item.projectType.toLowerCase().includes(type.toLowerCase())
      )
    ) {
      return false;
    }

    // Project stage filter
    if (
      selectedProjectFilters.projectStage.length > 0 &&
      item.projectStage &&
      !selectedProjectFilters.projectStage.includes(item.projectStage)
    ) {
      return false;
    }

    // Construction status filter
    if (
      selectedProjectFilters.constructionStatus.length > 0 &&
      item.constructionStatus &&
      !selectedProjectFilters.constructionStatus.includes(item.constructionStatus)
    ) {
      return false;
    }

    // Unit types filter (check if project has any of the selected unit types)
    if (
      selectedProjectFilters.unitTypes.length > 0 &&
      item.unitTypes &&
      Array.isArray(item.unitTypes)
    ) {
      const hasMatchingUnitType = item.unitTypes.some((unitType: any) => {
        return selectedProjectFilters.unitTypes.some(selectedType => {
          const unitTypeStr = unitType.type || '';
          return unitTypeStr.toLowerCase().includes(selectedType.toLowerCase().replace(' bhk', ''));
        });
      });
      if (!hasMatchingUnitType) {
        return false;
      }
    }

    // Possession year filter
    if (
      selectedProjectFilters.possessionYear.length > 0 &&
      item.possessionDate
    ) {
      const possessionYear = new Date(item.possessionDate).getFullYear().toString();
      const hasMatchingYear = selectedProjectFilters.possessionYear.some(year => {
        if (year === '2028+') {
          return parseInt(possessionYear) >= 2028;
        }
        return possessionYear === year;
      });
      if (!hasMatchingYear) {
        return false;
      }
    }

    // Area filter for projects (check unit types area ranges)
    if (
      selectedProjectFilters.area[0] > 0 ||
      selectedProjectFilters.area[1] < 10000
    ) {
      if (item.unitTypes && Array.isArray(item.unitTypes)) {
        const hasMatchingArea = item.unitTypes.some((unitType: any) => {
          const minArea = unitType.sizeRange?.min || 0;
          const maxArea = unitType.sizeRange?.max || 0;
          return (
            minArea >= selectedProjectFilters.area[0] && 
            maxArea <= selectedProjectFilters.area[1]
          ) || (
            maxArea >= selectedProjectFilters.area[0] && 
            minArea <= selectedProjectFilters.area[1]
          );
        });
        if (!hasMatchingArea) {
          return false;
        }
      }
    }

    // Price range filter for projects (check unit types price ranges)
    if (
      selectedProjectFilters.priceRange[0] > 0 ||
      selectedProjectFilters.priceRange[1] < 100000000
    ) {
      if (item.unitTypes && Array.isArray(item.unitTypes)) {
        const hasMatchingPrice = item.unitTypes.some((unitType: any) => {
          const minPrice = (unitType.priceRange?.min || 0) * 100000; // Convert lacs to rupees
          const maxPrice = (unitType.priceRange?.max || 0) * 100000;
          return (
            minPrice >= selectedProjectFilters.priceRange[0] && 
            maxPrice <= selectedProjectFilters.priceRange[1]
          ) || (
            maxPrice >= selectedProjectFilters.priceRange[0] && 
            minPrice <= selectedProjectFilters.priceRange[1]
          );
        });
        if (!hasMatchingPrice) {
          return false;
        }
      } else if (typeof item.price === 'number') {
        // Fallback to simple price check if unitTypes is not available
        if (
          item.price < selectedProjectFilters.priceRange[0] ||
          item.price > selectedProjectFilters.priceRange[1]
        ) {
          return false;
        }
      }
    }

    return true;
  };

  // Fallback function for client-side filtering with map bounds
  const fallbackToClientFiltering = () => {
    if (!mapBounds) return;

    console.log('Fallback filtering started');
    const { north, south, east, west } = mapBounds;

    // Filter from all search items (properties + projects)
    const itemsInBounds = allSearchItems.filter((item) => {
      if (!item.coordinates || item.coordinates.length !== 2) return false;

      const lat = item.coordinates[1];
      const lng = item.coordinates[0];

      // Check if the item is within map bounds
      const isInBounds = lat <= north && lat >= south && lng <= east && lng >= west;

      if (!isInBounds) return false;

      // Apply additional filters for properties
      if (item.type === 'property') {
        const property = allProperties.find(p => p._id === item._id);
        const matches = property ? isPropertyMatchingFilters(property) : false;
        if (matches) console.log('Property matches:', item.title);
        return matches;
      }

      // Apply additional filters for projects
      if (item.type === 'project') {
        const matches = isProjectMatchingFilters(item);
        if (matches) console.log('Project matches:', item.title);
        return matches;
      }

      return false;
    });

    console.log(`Fallback result: ${itemsInBounds.length} items found (${itemsInBounds.filter(i => i.type === 'property').length} properties, ${itemsInBounds.filter(i => i.type === 'project').length} projects)`);
    
    setFilteredSearchItems(itemsInBounds);
    
    // Update legacy properties for backward compatibility
    const propertiesOnly = itemsInBounds.filter(item => item.type === 'property');
    const legacyProperties = propertiesOnly.map(item => {
      return allProperties.find(prop => prop._id === item._id);
    }).filter(Boolean) as Property[];
    setFilteredProperties(legacyProperties);
  };

  const handleSearch = (_e: React.FormEvent) => {
    _e.preventDefault();

    filterSearchItems();
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleProjectFilterChange = (filterType: keyof ProjectFilterState, value: any) => {
    setSelectedProjectFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleMapBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
    // searchPropertiesInMapBounds();
    setSelectedFilters((prev) => ({
      ...prev,
      mapBounds: bounds,
    }));
  };

  // Update filterProperties function to properly filter both properties and projects
  const filterSearchItems = useCallback(() => {
    let itemsToFilter = allSearchItems;

    // Filter by type if specified
    if (showingType === 'properties') {
      itemsToFilter = allSearchItems.filter(item => item.type === 'property');
    } else if (showingType === 'projects') {
      itemsToFilter = allSearchItems.filter(item => item.type === 'project');
    }

    const filtered = itemsToFilter.filter((item) => {
      // Skip items without proper coordinates
      if (!item.coordinates || item.coordinates.length !== 2) {
        return false;
      }

      // Search query filter
      if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          (item.propertyType && item.propertyType.toLowerCase().includes(query)) ||
          (item.projectType && item.projectType.toLowerCase().includes(query)) ||
          (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query)));

        if (!matchesSearch) return false;
      }

      // For properties
      if (item.type === 'property') {
        // Property type filter - case insensitive comparison
        if (
          selectedFilters.propertyType.length > 0 &&
          !selectedFilters.propertyType.some(
            (type) =>
              item.propertyType &&
              item.propertyType.toLowerCase() === type.toLowerCase(),
          )
        ) {
          return false;
        }

        // Status filter (rent or sale) - check listingType property
        if (
          selectedFilters.status.length > 0 &&
          !selectedFilters.status.some(
            (status) => item.listingType === status,
          )
        ) {
          return false;
        }

        // Beds filter - exact match
        if (
          selectedFilters.beds.length > 0 &&
          item.bedrooms &&
          !selectedFilters.beds.includes(item.bedrooms)
        ) {
          return false;
        }

        // Baths filter - exact match
        if (
          selectedFilters.baths.length > 0 &&
          item.bathrooms &&
          !selectedFilters.baths.includes(item.bathrooms)
        ) {
          return false;
        }

        // Area filter for properties
        if (typeof item.area === 'number') {
          if (
            item.area < selectedFilters.area[0] ||
            item.area > selectedFilters.area[1]
          ) {
            return false;
          }
        }

        // Price filter for properties
        if (typeof item.price === 'number') {
          if (
            item.price < selectedFilters.priceRange[0] ||
            item.price > selectedFilters.priceRange[1]
          ) {
            return false;
          }
        }
      }

      // For projects - use separate project filters
      if (item.type === 'project') {
        // Project type filter
        if (
          selectedProjectFilters.projectType.length > 0 &&
          item.projectType &&
          !selectedProjectFilters.projectType.some(
            (type) => item.projectType && item.projectType.toLowerCase().includes(type.toLowerCase())
          )
        ) {
          return false;
        }

        // Project stage filter
        if (
          selectedProjectFilters.projectStage.length > 0 &&
          item.projectStage &&
          !selectedProjectFilters.projectStage.includes(item.projectStage)
        ) {
          return false;
        }

        // Construction status filter
        if (
          selectedProjectFilters.constructionStatus.length > 0 &&
          item.constructionStatus &&
          !selectedProjectFilters.constructionStatus.includes(item.constructionStatus)
        ) {
          return false;
        }

        // Unit types filter (check if project has any of the selected unit types)
        if (
          selectedProjectFilters.unitTypes.length > 0 &&
          item.unitTypes &&
          Array.isArray(item.unitTypes)
        ) {
          const hasMatchingUnitType = item.unitTypes.some((unitType: any) => {
            return selectedProjectFilters.unitTypes.some(selectedType => {
              const unitTypeStr = unitType.type || '';
              return unitTypeStr.toLowerCase().includes(selectedType.toLowerCase().replace(' bhk', ''));
            });
          });
          if (!hasMatchingUnitType) {
            return false;
          }
        }

        // Possession year filter
        if (
          selectedProjectFilters.possessionYear.length > 0 &&
          item.possessionDate
        ) {
          const possessionYear = new Date(item.possessionDate).getFullYear().toString();
          const hasMatchingYear = selectedProjectFilters.possessionYear.some(year => {
            if (year === '2028+') {
              return parseInt(possessionYear) >= 2028;
            }
            return possessionYear === year;
          });
          if (!hasMatchingYear) {
            return false;
          }
        }

        // Area filter for projects (check unit types area ranges)
        if (item.unitTypes && Array.isArray(item.unitTypes)) {
          const hasMatchingArea = item.unitTypes.some((unitType: any) => {
            const minArea = unitType.sizeRange?.min || 0;
            const maxArea = unitType.sizeRange?.max || 0;
            return (
              minArea >= selectedProjectFilters.area[0] && 
              maxArea <= selectedProjectFilters.area[1]
            ) || (
              maxArea >= selectedProjectFilters.area[0] && 
              minArea <= selectedProjectFilters.area[1]
            );
          });
          if (!hasMatchingArea) {
            return false;
          }
        }

        // Price filter for projects (check unit types price ranges)
        if (item.unitTypes && Array.isArray(item.unitTypes)) {
          const hasMatchingPrice = item.unitTypes.some((unitType: any) => {
            const minPrice = (unitType.priceRange?.min || 0) * 100000; // Convert lacs to rupees
            const maxPrice = (unitType.priceRange?.max || 0) * 100000;
            return (
              minPrice >= selectedProjectFilters.priceRange[0] && 
              maxPrice <= selectedProjectFilters.priceRange[1]
            ) || (
              maxPrice >= selectedProjectFilters.priceRange[0] && 
              minPrice <= selectedProjectFilters.priceRange[1]
            );
          });
          if (!hasMatchingPrice) {
            return false;
          }
        }
      }

      return true;
    });

    setFilteredSearchItems(filtered);
    
    // Also update the legacy filtered properties for backward compatibility
    const propertiesOnly = filtered.filter(item => item.type === 'property');
    const legacyProperties = propertiesOnly.map(item => {
      // Convert back to Property interface for components that still expect it
      return allProperties.find(prop => prop._id === item._id);
    }).filter(Boolean) as Property[];
    setFilteredProperties(legacyProperties);
  }, [allSearchItems, searchQuery, selectedFilters, selectedProjectFilters, showingType, allProperties]);

  // Move useEffect to the end of the component
  useEffect(() => {
    // Add a small delay to prevent too many rapid calls when changing filters
    const timer = setTimeout(() => {

      filterSearchItems();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedFilters, selectedProjectFilters, searchQuery, showingType, filterSearchItems]);

  // Make a separate useEffect for data changes
  useEffect(() => {
    if (allSearchItems.length > 0) {

      filterSearchItems();
    }
  }, [allSearchItems, filterSearchItems]);

  // Detect screen size and set initial view mode
  useEffect(() => {
    const handleResize = () => {
      // On larger screens (md and up), use split view
      // On mobile, default to showing the list view
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'list' : 'split');
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset filters function
  const resetFilters = () => {
    setSelectedFilters({
      priceRange: [0, 100000000],
      propertyType: [],
      status: [],
      beds: [],
      baths: [],
      area: [0, 10000],
    });
    setSelectedProjectFilters({
      priceRange: [0, 100000000],
      projectType: [],
      projectStage: [],
      constructionStatus: [],
      unitTypes: [],
      area: [0, 10000],
      possessionYear: [],
    });
    setSearchQuery("");
  };

  // Handle favorite toggle for search items
  const handleFavoriteToggle = async (itemId: string, itemType: 'property' | 'project') => {
    if (!token) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      await toggleFavorite(itemId, itemType);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      setArticlesLoading(true);
      setArticlesError(null);

      try {
        // Using GNews API instead of NewsAPI.org
        const response = await axios.get("https://gnews.io/api/v4/search", {
          params: {
            q: "real estate property market india",
            lang: "en",
            max: 100,
            apikey: "ee109d074f15362d67dd776ff2b449e8", // GNews API key
          },
        });

        if (response.data && response.data.articles) {
          // Transform the data to match our interface
          const transformedArticles = response.data.articles.map(
            (
              article: {
                title: string;
                description?: string;
                url: string;
                image?: string; // GNews uses 'image' instead of 'urlToImage'
                publishedAt: string;
                source: { name: string };
              },
              index: number,
            ) => ({
              id: `article-${index}`,
              title: article.title,
              description: article.description || "No description available",
              url: article.url,
              urlToImage: article.image || "/placeholder-news.jpg", // Map image to urlToImage
              publishedAt: article.publishedAt,
              source: article.source,
              category: categorizeArticle(
                article.title,
                article.description || "",
              ),
            }),
          );

          setArticles(transformedArticles);
        } else {
          setArticlesError("No articles found");
        }
      } catch (_error) {

        setArticlesError("Failed to fetch articles");

        // Use fallback articles similar to what we do in property-news.tsx
        const fallbackArticles = Array(10)
          .fill(0)
          .map((_, index) => ({
            id: `article-${index}`,
            title: `Property Market Insight #${index + 1}`,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl.",
            url: "#",
            urlToImage: `https://images.unsplash.com/photo-${1560518883 + index * 10}-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80`,
            publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
            source: { name: "Property Insights" },
            category: index % 2 === 0 ? "Market Analysis" : "Investment Tips",
          }));
        setArticles(fallbackArticles);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Helper function to categorize articles
  const categorizeArticle = (title: string, description: string): string => {
    const content = `${title} ${description}`.toLowerCase();

    if (
      content.includes("market") ||
      content.includes("price") ||
      content.includes("investment")
    ) {
      return "Market";
    } else if (
      content.includes("policy") ||
      content.includes("regulation") ||
      content.includes("law")
    ) {
      return "Policy";
    } else if (
      content.includes("tips") ||
      content.includes("advice") ||
      content.includes("guide")
    ) {
      return "Advice";
    } else {
      return "News";
    }
  };

  // Format publication date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const navItems = [{ label: "Home", href: "/" }];

  // Initialize from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedNewProperties = sessionStorage.getItem(
          "newlyAddedProperties",
        );
        if (storedNewProperties) {
          setNewlyAddedProperties(new Set(JSON.parse(storedNewProperties)));
        }
      } catch (_e) {

      }
    }
  }, []);

  // This function will be called when new properties are added to the system
  // Add a useEffect to fetch user favorites when the component loads
  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       // Fetch user's favorite properties
  //       const response = await axios.get("/api/users/favorites/properties");
  //       setFavorites({
  //         properties: response.data.favorites.map(
  //           (fav: { _id: string }) => fav._id,
  //         ),
  //       });
  //     } catch (_error) {
  //       //     }
  //   };

  //   fetchFavorites();
  // }, [mockArticles]);

  // If you are using Leaflet, import Map from 'leaflet' at the top:
  // import type { Map as LeafletMap } from 'leaflet';
  // If using another map library, use its map instance type.
  // For now, we'll use 'any' for compatibility:
  const [mapInstance, setMapInstance] = useState<any>(null);
  // Effect to handle resize and map invalidation
  useEffect(() => {
    const handleResize = () => {
      // On larger screens (md and up), use split view
      // On mobile, keep current view mode but ensure map is properly sized
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setViewMode('split');
      }
      
      // If map is visible, make sure to resize it
      if ((viewMode === 'map' || viewMode === 'split') && mapInstance) {
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 300);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [mapInstance, viewMode]);

  useEffect(() => {
    if ((viewMode === 'map' || viewMode === 'split') && mapInstance) {
      // Use multiple timeouts for better reliability across different devices
      const timeouts = [100, 300, 600, 1000].map(delay =>
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, delay)
      );
      
      return () => {
        // Clear all timeouts on cleanup
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [viewMode, mapInstance]);

  // Create ResizeObserver for reliable map sizing
  useEffect(() => {
    if (!mapInstance) return;
    
    // Try to find the map container element
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    
    // Create a ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the resize to avoid too many invalidations
      if (mapInstance) {
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 100);
      }
    });
    
    // Start observing the map container
    resizeObserver.observe(mapContainer);
    
    return () => {
      // Cleanup observer on component unmount
      resizeObserver.disconnect();
    };
  }, [mapInstance]);

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      

      {/* Fixed Search Bar */}
      <div className="sticky top-0 z-50 bg-black shadow-orange-500 shadow-md flex-shrink-0">
        <div className="container mx-auto px-0 md:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center pl-4 md:pl-0">
              <Image src="/logoF.png" alt="Algoric" width={64} height={64} />
            </div>

            <div className="flex items-center gap-3 flex-1 px-4 md:px-0 md:ml-8 md:max-w-xl">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(_e) => setSearchQuery(_e.target.value)}
                  onKeyDown={(_e) => {
                    if (_e.key === "Enter") {
                      _e.preventDefault();
                      filterSearchItems();
                    }
                  }}
                  placeholder="Search location, property type..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-black"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="px-3 py-2 bg-orange-500 text-white rounded-md transition-colors flex items-center gap-1 hover:bg-orange-600"
              >
                <FaFilter className="h-3 w-3" />
                <span className="text-sm">Filters</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 pr-4 md:pr-0">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-orange-600">
                  {filteredSearchItems.length}
                </span>{" "}
                results found
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(((selectedFilters.propertyType.length > 0 ||
            selectedFilters.beds.length > 0 ||
            selectedFilters.priceRange[0] > 0 ||
            selectedFilters.priceRange[1] < 100000000 ||
            selectedFilters.area[0] > 0 ||
            selectedFilters.area[1] < 10000 ||
            selectedFilters.status.length > 0) && (showingType === 'properties' || showingType === 'all')) ||
           ((selectedProjectFilters.projectType.length > 0 ||
            selectedProjectFilters.projectStage.length > 0 ||
            selectedProjectFilters.constructionStatus.length > 0 ||
            selectedProjectFilters.unitTypes.length > 0 ||
            selectedProjectFilters.possessionYear.length > 0 ||
            selectedProjectFilters.priceRange[0] > 0 ||
            selectedProjectFilters.priceRange[1] < 100000000 ||
            selectedProjectFilters.area[0] > 0 ||
            selectedProjectFilters.area[1] < 10000) && (showingType === 'projects' || showingType === 'all'))) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">Active filters:</span>

              {/* Property Filters */}
              {(showingType === 'properties' || showingType === 'all') && (
                <>
                  {selectedFilters.status.includes("sale") && (
                    <button
                      onClick={() => {
                        const newStatus = selectedFilters.status.filter((s) => s !== "sale");
                        handleFilterChange("status", newStatus);
                      }}
                      className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                    >
                      For Sale <FaTimes className="h-2 w-2" />
                    </button>
                  )}

                  {selectedFilters.status.includes("rent") && (
                    <button
                      onClick={() => {
                        const newStatus = selectedFilters.status.filter((s) => s !== "rent");
                        handleFilterChange("status", newStatus);
                      }}
                      className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                    >
                      For Rent <FaTimes className="h-2 w-2" />
                    </button>
                  )}

                  {selectedFilters.propertyType.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = selectedFilters.propertyType.filter((t) => t !== type);
                        handleFilterChange("propertyType", newTypes);
                      }}
                      className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                    >
                      {type} <FaTimes className="h-2 w-2" />
                    </button>
                  ))}

                  {selectedFilters.beds.length > 0 && (
                    <button
                      onClick={() => handleFilterChange("beds", [])}
                      className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                    >
                      {selectedFilters.beds.join(", ")} BHK <FaTimes className="h-2 w-2" />
                    </button>
                  )}

                  {(selectedFilters.priceRange[0] > 0 ||
                    selectedFilters.priceRange[1] < 100000000) && (
                    <button
                      onClick={() => handleFilterChange("priceRange", [0, 100000000])}
                      className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                    >
                      Property ₹{selectedFilters.priceRange[0] / 100000}L - ₹
                      {selectedFilters.priceRange[1] / 100000}L <FaTimes className="h-2 w-2" />
                    </button>
                  )}

                  {(selectedFilters.area[0] > 0 || selectedFilters.area[1] < 10000) && (
                    <button
                      onClick={() => handleFilterChange("area", [0, 10000])}
                      className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                    >
                      Property {selectedFilters.area[0]}-{selectedFilters.area[1]} sqft{" "}
                      <FaTimes className="h-2 w-2" />
                    </button>
                  )}
                </>
              )}

              {/* Project Filters */}
              {(showingType === 'projects' || showingType === 'all') && (
                <>
                  {selectedProjectFilters.projectType.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = selectedProjectFilters.projectType.filter((t) => t !== type);
                        handleProjectFilterChange("projectType", newTypes);
                      }}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      {type} <FaTimes className="h-2 w-2" />
                    </button>
                  ))}

                  {selectedProjectFilters.projectStage.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => {
                        const newStages = selectedProjectFilters.projectStage.filter((s) => s !== stage);
                        handleProjectFilterChange("projectStage", newStages);
                      }}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      {stage} <FaTimes className="h-2 w-2" />
                    </button>
                  ))}

                  {selectedProjectFilters.constructionStatus.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const newStatuses = selectedProjectFilters.constructionStatus.filter((s) => s !== status);
                        handleProjectFilterChange("constructionStatus", newStatuses);
                      }}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      {status} <FaTimes className="h-2 w-2" />
                    </button>
                  ))}

                  {selectedProjectFilters.unitTypes.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        const newUnits = selectedProjectFilters.unitTypes.filter((u) => u !== unit);
                        handleProjectFilterChange("unitTypes", newUnits);
                      }}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      {unit} <FaTimes className="h-2 w-2" />
                    </button>
                  ))}

                  {selectedProjectFilters.possessionYear.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        const newYears = selectedProjectFilters.possessionYear.filter((y) => y !== year);
                        handleProjectFilterChange("possessionYear", newYears);
                      }}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      {year} <FaTimes className="h-2 w-2" />
                    </button>
                  ))}

                  {(selectedProjectFilters.priceRange[0] > 0 ||
                    selectedProjectFilters.priceRange[1] < 100000000) && (
                    <button
                      onClick={() => handleProjectFilterChange("priceRange", [0, 100000000])}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      Project ₹{selectedProjectFilters.priceRange[0] / 100000}L - ₹
                      {selectedProjectFilters.priceRange[1] / 100000}L <FaTimes className="h-2 w-2" />
                    </button>
                  )}

                  {(selectedProjectFilters.area[0] > 0 || selectedProjectFilters.area[1] < 10000) && (
                    <button
                      onClick={() => handleProjectFilterChange("area", [0, 10000])}
                      className="px-2 py-1 bg-blue-800 text-white text-xs rounded-md flex items-center gap-1 border border-blue-700"
                    >
                      Project {selectedProjectFilters.area[0]}-{selectedProjectFilters.area[1]} sqft{" "}
                      <FaTimes className="h-2 w-2" />
                    </button>
                  )}
                </>
              )}

              <button
                onClick={resetFilters}
                className="px-2 py-2 bg-orange-600 hover:text-orange-600 text-xs transition-colors font-medium rounded-lg"
              >
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal - Separated by Properties/Projects */}
      <AnimatePresence>
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/50 flex items-start justify-end z-[1000]"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="bg-black h-full w-full md:max-w-md overflow-y-auto shadow-orange-500 shadow-sm"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(_e) => _e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 z-10 border-b border-gray-700">
                <div className="flex items-center justify-between p-4 pb-0">
                  <h2 className="text-lg font-medium text-white">Filters</h2>
                  <button
                    className="p-1 rounded-full hover:bg-gray-700"
                    onClick={() => setShowFilters(false)}
                  >
                    <FaTimes className="h-4 w-4 text-white" />
                  </button>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex bg-black/20 rounded-lg mx-4 mt-3 mb-4 p-1">
                  <button
                    onClick={() => setFilterTab('properties')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      filterTab === 'properties'
                        ? 'bg-white text-orange-600'
                        : 'text-white hover:text-gray-200'
                    }`}
                  >
                    Properties
                  </button>
                  <button
                    onClick={() => setFilterTab('projects')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      filterTab === 'projects'
                        ? 'bg-white text-orange-600'
                        : 'text-white hover:text-gray-200'
                    }`}
                  >
                    Projects
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Property Filters Tab */}
                {filterTab === 'properties' && (
                  <>
                    {/* Property Status */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Status</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            const newStatus = selectedFilters.status.includes("sale")
                              ? selectedFilters.status.filter((s) => s !== "sale")
                              : [...selectedFilters.status, "sale"];
                            handleFilterChange("status", newStatus);
                          }}
                          className={`px-4 py-2 rounded-md text-sm ${
                            selectedFilters.status.includes("sale")
                              ? "bg-orange-500 text-white"
                              : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                          }`}
                        >
                          For Sale
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = selectedFilters.status.includes("rent")
                              ? selectedFilters.status.filter((s) => s !== "rent")
                              : [...selectedFilters.status, "rent"];
                            handleFilterChange("status", newStatus);
                          }}
                          className={`px-4 py-2 rounded-md text-sm ${
                            selectedFilters.status.includes("rent")
                              ? "bg-orange-500 text-white"
                              : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                          }`}
                        >
                          For Rent
                        </button>
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Property Type</h3>
                      <div className="flex flex-wrap gap-2">
                        {propertyTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              const newTypes = selectedFilters.propertyType.includes(type)
                                ? selectedFilters.propertyType.filter((t) => t !== type)
                                : [...selectedFilters.propertyType, type];
                              handleFilterChange("propertyType", newTypes);
                            }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              selectedFilters.propertyType.includes(type)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BHK Configuration */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Bedrooms</h3>
                      <div className="flex gap-1">
                        {bedOptions.map((bed) => (
                          <button
                            key={bed}
                            onClick={() => {
                              const newBeds = selectedFilters.beds.includes(bed)
                                ? selectedFilters.beds.filter((b) => b !== bed)
                                : [...selectedFilters.beds, bed];
                              handleFilterChange("beds", newBeds);
                            }}
                            className={`flex-1 py-2 rounded-md text-sm ${
                              selectedFilters.beds.includes(bed)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {bed} BHK
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Price Range */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Price Range</h3>
                      <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => handleFilterChange("priceRange", range.value)}
                            className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                              selectedFilters.priceRange[0] === range.value[0] &&
                              selectedFilters.priceRange[1] === range.value[1]
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Area Range */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Area (sqft)</h3>
                      <div className="space-y-2">
                        {areaRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => handleFilterChange("area", range.value)}
                            className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                              selectedFilters.area[0] === range.value[0] &&
                              selectedFilters.area[1] === range.value[1]
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Project Filters Tab */}
                {filterTab === 'projects' && (
                  <>
                    {/* Project Type */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Project Type</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              const newTypes = selectedProjectFilters.projectType.includes(type)
                                ? selectedProjectFilters.projectType.filter((t) => t !== type)
                                : [...selectedProjectFilters.projectType, type];
                              handleProjectFilterChange("projectType", newTypes);
                            }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              selectedProjectFilters.projectType.includes(type)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Stage */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Project Stage</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectStages.map((stage) => (
                          <button
                            key={stage}
                            onClick={() => {
                              const newStages = selectedProjectFilters.projectStage.includes(stage)
                                ? selectedProjectFilters.projectStage.filter((s) => s !== stage)
                                : [...selectedProjectFilters.projectStage, stage];
                              handleProjectFilterChange("projectStage", newStages);
                            }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              selectedProjectFilters.projectStage.includes(stage)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {stage}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Construction Status */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Construction Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {constructionStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              const newStatuses = selectedProjectFilters.constructionStatus.includes(status)
                                ? selectedProjectFilters.constructionStatus.filter((s) => s !== status)
                                : [...selectedProjectFilters.constructionStatus, status];
                              handleProjectFilterChange("constructionStatus", newStatuses);
                            }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              selectedProjectFilters.constructionStatus.includes(status)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Unit Types */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Unit Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {unitTypeOptions.map((unit) => (
                          <button
                            key={unit}
                            onClick={() => {
                              const newUnitTypes = selectedProjectFilters.unitTypes.includes(unit)
                                ? selectedProjectFilters.unitTypes.filter((u) => u !== unit)
                                : [...selectedProjectFilters.unitTypes, unit];
                              handleProjectFilterChange("unitTypes", newUnitTypes);
                            }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              selectedProjectFilters.unitTypes.includes(unit)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Possession Year */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Possession Year</h3>
                      <div className="flex flex-wrap gap-2">
                        {possessionYears.map((year) => (
                          <button
                            key={year}
                            onClick={() => {
                              const newYears = selectedProjectFilters.possessionYear.includes(year)
                                ? selectedProjectFilters.possessionYear.filter((y) => y !== year)
                                : [...selectedProjectFilters.possessionYear, year];
                              handleProjectFilterChange("possessionYear", newYears);
                            }}
                            className={`px-3 py-2 rounded-md text-sm ${
                              selectedProjectFilters.possessionYear.includes(year)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Price Range */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Price Range</h3>
                      <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => handleProjectFilterChange("priceRange", range.value)}
                            className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                              selectedProjectFilters.priceRange[0] === range.value[0] &&
                              selectedProjectFilters.priceRange[1] === range.value[1]
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Area Range */}
                    <div>
                      <h3 className="font-medium mb-3 text-white">Area (sqft)</h3>
                      <div className="space-y-2">
                        {areaRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => handleProjectFilterChange("area", range.value)}
                            className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                              selectedProjectFilters.area[0] === range.value[0] &&
                              selectedProjectFilters.area[1] === range.value[1]
                                ? "bg-orange-500 text-white"
                                : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="sticky bottom-0 bg-black p-4 border-t border-gray-700 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-md bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setShowFilters(false);
                    filterSearchItems();
                  }}
                  className="flex-1 py-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile View Toggle Buttons - Only visible on small screens */}
      <div className="md:hidden flex-shrink-0 z-20 bg-black py-2 px-4 flex justify-between border-b border-gray-800">
        <div className="flex items-center">
          <Image src="/logoF.png" height={40} width={40} alt="Algoric" className="mr-2" />
          <div className="text-xs text-gray-400">
            <span className="font-medium text-orange-600">
              {filteredSearchItems.length}
            </span>{" "}
            results
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-orange-500' : 'bg-gray-700'} text-white rounded-l-md text-sm font-medium flex items-center gap-1.5`}
          >
            <FaList className="h-3 w-3" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 ${viewMode === 'map' ? 'bg-orange-500' : 'bg-gray-700'} text-white rounded-r-md text-sm font-medium flex items-center gap-1.5`}
          >
            <FaMap className="h-3 w-3" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Type Toggle - Properties/Projects */}
      <div className="flex-shrink-0 z-20 bg-black py-2 md:py-3 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setShowingType('all')}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    showingType === 'all' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  All <span className="hidden sm:inline">({allSearchItems.length})</span>
                </button>
                <button
                  onClick={() => setShowingType('properties')}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    showingType === 'properties' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Properties <span className="hidden sm:inline">({allSearchItems.filter(item => item.type === 'property').length})</span>
                </button>
                <button
                  onClick={() => setShowingType('projects')}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    showingType === 'projects' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Projects <span className="hidden sm:inline">({allSearchItems.filter(item => item.type === 'project').length})</span>
                </button>
              </div>
            </div>
            
            <div className="hidden md:block text-sm text-gray-400">
              <span className="font-medium text-orange-600">
                {filteredSearchItems.length}
              </span>{" "}
              results found
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Map Section */}
        <div
          id="map-container"
          className={`${
            viewMode === 'list' ? "hidden" : "block"
          } ${
            viewMode === 'split' ? "md:flex-1" : "flex-1"
          } h-full overflow-hidden relative`}
          style={{ 
            display: (viewMode === 'map' || (viewMode === 'split' && window.innerWidth >= 768)) ? 'block' : 'none' 
          }}
        >
          <MapErrorBoundary>
            <Map
              center={mapCenter}
              zoom={zoom}
              onMapLoad={setMapInstance}
              properties={filteredSearchItems.map((item) => {
                // Format price display based on item type
                let priceDisplay;
                if (item.type === 'property') {
                  priceDisplay = typeof item.price === "string" ? item.price : `₹${item.price.toLocaleString()}`;
                } else {
                  // For projects, show the range in lacs
                  if (item.unitTypes && Array.isArray(item.unitTypes)) {
                    const minPrice = Math.min(...item.unitTypes.map((u: any) => u.priceRange.min));
                    const maxPrice = Math.max(...item.unitTypes.map((u: any) => u.priceRange.max));
                    priceDisplay = `₹${minPrice}-${maxPrice} Lacs`;
                  } else {
                    priceDisplay = typeof item.price === "string" ? item.price : `₹${(item.price / 100000).toFixed(1)} Lacs`;
                  }
                }

                return {
                  id: item._id,
                  coordinates: item.coordinates && item.coordinates.length === 2
                    ? {
                        lat: item.coordinates[1],
                        lng: item.coordinates[0],
                      }
                    : { lat: 28.7041, lng: 77.1025 }, // Default to Delhi if no coordinates
                  title: item.title,
                  price: priceDisplay,
                  type: (item.type === 'property' ? item.propertyType : item.projectType) || 'Unknown',
                  isNew: newlyAddedProperties.has(item._id), // Mark as new if in our tracked set
                };
              })}
              onMarkerClick={(propertyId) => {
                const element = document.getElementById(`property-${propertyId}`);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onBoundsChanged={handleMapBoundsChange}
              // mapStyle="dark" // Set the map style to dark
            />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center z-[100]">
              <button
                onClick={() => {
                  if (mapBounds) {
                    // Simple map bounds search - just filter by location and showing type
                    const { north, south, east, west } = mapBounds;
                    
                    // Filter all search items by map bounds only
                    const itemsInBounds = allSearchItems.filter((item) => {
                      if (!item.coordinates || item.coordinates.length !== 2) return false;

                      const lat = item.coordinates[1];
                      const lng = item.coordinates[0];
                      
                      // Check if item is within map bounds
                      const isInBounds = lat <= north && lat >= south && lng <= east && lng >= west;
                      
                      // Filter by showing type
                      if (showingType === 'properties') {
                        return isInBounds && item.type === 'property';
                      } else if (showingType === 'projects') {
                        return isInBounds && item.type === 'project';
                      } else {
                        return isInBounds; // Show all types
                      }
                    });

                    console.log(`Search this area found: ${itemsInBounds.length} items (${itemsInBounds.filter(i => i.type === 'property').length} properties, ${itemsInBounds.filter(i => i.type === 'project').length} projects)`);
                    
                    setFilteredSearchItems(itemsInBounds);
                    
                    // Update legacy properties for backward compatibility
                    const propertiesOnly = itemsInBounds.filter(item => item.type === 'property');
                    const legacyProperties = propertiesOnly.map(item => {
                      return allProperties.find(prop => prop._id === item._id);
                    }).filter(Boolean) as Property[];
                    setFilteredProperties(legacyProperties);
                    
                    // On mobile, switch to list view after search
                    if (window.innerWidth < 768) {
                      setViewMode('list');
                    }
                  }
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-xl hover:bg-orange-600 transition-colors font-medium text-sm border-2 border-white/20 backdrop-blur-sm"
              >
                Search this area
              </button>

              {/* List view toggle button - only visible on mobile when map is shown */}
              {viewMode === 'map' && (
                <button
                  onClick={() => setViewMode('list')}
                  className="md:hidden bg-black/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-medium border border-gray-600 shadow-lg"
                >
                  📋 View List
                </button>
              )}
            </div>
          </MapErrorBoundary>
        </div>

        {/* Properties List + Articles Section */}
        <div
          className={`${viewMode === 'map' ? "hidden" : "flex"} ${
            viewMode === 'split' ? "md:w-1/2" : "w-full"
          } bg-black flex-col min-h-0`}
          style={{ 
            display: (viewMode === 'list' || (viewMode === 'split' && window.innerWidth >= 768)) ? 'flex' : 'none' 
          }}
        >          <div className="flex-1 overflow-y-auto">
            <div className="p-3 md:p-6 min-h-full">
              {/* Results Count + Article Toggle */}
              <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-orange-600">
                  {filteredSearchItems.length}
                </span>{" "}
                results found
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowArticles(!showArticles)}
                  className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <FaNewspaper className="h-3 w-3" />
                  <span>
                    {showArticles ? "Hide Articles" : "Show Articles"}
                  </span>
                </button>
              </div>
            </div>

            {/* Search Results List */}
            {!showArticles && (
              <>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : filteredSearchItems.length > 0 ? (
                  <div className="space-y-3 md:space-y-4 pb-20">
                    {filteredSearchItems.map((item) => (
                      <motion.div
                        key={item._id}
                        id={`item-${item._id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all text-white border border-gray-800`}
                      >
                        <div
                          className="flex flex-col md:flex-row cursor-pointer"
                          onClick={() => {
                            if (item.type === 'property') {
                              router.push(`/search/${item._id}`);
                            } else {
                              router.push(`/projects/${item._id}`);
                            }
                          }}
                        >
                          <div className="relative w-full md:w-2/5 h-48 md:h-auto">
                            <Image
                              src={
                                item.images && item.images.length > 0
                                  ? item.images[0]
                                  : "/placeholder-property.jpg"
                              }
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 40vw"
                              className="object-cover"
                              priority={false}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-property.jpg";
                              }}
                            />
                            <div className="absolute top-2 right-2">
                              {item.type === 'property' ? (
                                <span className="bg-orange-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                                  {item.listingType === "rent" ? "For Rent" : "For Sale"}
                                </span>
                              ) : (
                                <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                                  Project
                                </span>
                              )}
                            </div>
                            {newlyAddedProperties.has(item._id) && (
                              <div className="absolute top-2 left-2">
                                <span className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                                  New
                                </span>
                              </div>
                            )}
                            
                          </div>
                          <div className="p-4 md:w-3/5 flex flex-col">
                            <div className="mb-auto">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-base font-medium text-white line-clamp-1">
                                  {item.title}
                                </h3>
                                <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                                  {item.type === 'property' ? 'Property' : 'Project'}
                                </span>
                              </div>
                              <p className="text-xs mt-1 flex items-center text-white/60">
                                <FaMapMarkerAlt className="h-3 w-3 mr-1 text-orange-400" />
                                {item.location || "Location unavailable"}
                              </p>

                              <div className="mt-3 flex items-center text-xs text-white/70 flex-wrap gap-x-3 gap-y-1">
                                {item.type === 'property' ? (
                                  <>
                                    {item.bedrooms && (
                                      <span className="flex items-center">
                                        <FaBed className="h-3 w-3 mr-1" />
                                        {item.bedrooms} BR
                                      </span>
                                    )}
                                    {item.bathrooms && (
                                      <span className="flex items-center">
                                        <FaBath className="h-3 w-3 mr-1" />
                                        {item.bathrooms} BA
                                      </span>
                                    )}
                                    {item.area && (
                                      <span className="flex items-center">
                                        <FaRuler className="h-3 w-3 mr-1" />
                                        {typeof item.area === 'number' ? `${item.area} sqft` : item.area}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {item.constructionStatus && (
                                      <span className="flex items-center">
                                        <FaBuilding className="h-3 w-3 mr-1" />
                                        {item.constructionStatus}
                                      </span>
                                    )}
                                    {item.projectStage && (
                                      <span className="flex items-center">
                                        <FaClock className="h-3 w-3 mr-1" />
                                        {item.projectStage}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white">
                                  {item.type === 'property' 
                                    ? `₹${item.price ? item.price.toLocaleString() : "N/A"}`
                                    : (item.unitTypes && Array.isArray(item.unitTypes)
                                        ? (() => {
                                            const minPrice = Math.min(...item.unitTypes.map((u: any) => u.priceRange.min));
                                            const maxPrice = Math.max(...item.unitTypes.map((u: any) => u.priceRange.max));
                                            return `₹${minPrice}-${maxPrice} Lacs`;
                                          })()
                                        : `₹${item.price ? (Number(item.price) / 100000).toFixed(1) : "N/A"} Lacs`
                                      )
                                  }
                                </span>
                                {item.type === 'property' && item.listingType === "rent" && (
                                  <span className="text-xs text-white/60">/month</span>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.type === 'property') {
                                    router.push(`/search/${item._id}`);
                                  } else {
                                    router.push(`/projects/${item._id}`);
                                  }
                                }}
                                className="text-xs px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 bg-white rounded-md shadow-orange-500 shadow-sm border border-gray-700">
                    <FaSearch className="h-6 w-6 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      No results found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm rounded-md hover:shadow-md"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Articles Section */}
            {showArticles && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Real Estate News
                  </h2>
                </div>

                {articlesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : articlesError ? (
                  <div className="text-center py-8 px-4 bg-white rounded-md shadow-orange-500 shadow-sm border border-gray-700">
                    <p className="text-gray-500">{articlesError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-md shadow-orange-500 shadow-sm overflow-hidden border border-gray-700 flex flex-col"
                      >
                        <div className="relative h-40">
                          <Image
                            src={article.urlToImage}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                            {article.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatDate(article.publishedAt)}
                            </span>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1 border border-gray-700"
                            >
                              Read Article <FaArrowRight className="h-2 w-2" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div
        className="fixed bottom-1 left-0 right-0 z-50 flex justify-center items-center pb-4 md:pb-6 pointer-events-none"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="backdrop-blur-lg rounded-full shadow-lg border border-white/20 px-2 py-1.5 pointer-events-auto bg-orange-600 hover:bg-orange-800">
          <div className="flex space-x-1 relative">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2 py-1 text-base rounded-full transition-all duration-300 font-bold ${
                  item.href === "/search" ? "text-white" : "text-white"
                }`}
              >
                {item.href === "/search" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black to-orange-500 rounded-full -z-10"
                    layoutId="indicator"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Error boundary for Map component
class MapErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Map error occurred - silent logging
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <div className="text-gray-500 mb-4">
              <FaMap className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Map temporarily unavailable</h3>
              <p className="text-sm mt-2">
                The map is having trouble loading. Please refresh the page or try again later.
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SearchPage;