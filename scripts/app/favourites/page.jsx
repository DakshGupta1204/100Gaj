"use client";
import { useState, useEffect } from "react";
import { FavoritesAPI } from "../lib/api-helpers";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, HomeIcon, Building, Users, MapPin } from "lucide-react";
import Navbar from "../components/navbar";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function FavoritesPage() {
    const [activeTab, setActiveTab] = useState("properties");
    const [properties, setProperties] = useState([]);
    const [agents, setAgents] = useState([]);
    const [builders, setBuilders] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [token, setToken] = useState(null);
    const router = useRouter();
    // Check authentication on mount
    useEffect(() => {
        const storedToken = sessionStorage.getItem("authToken");
        if (!storedToken) {
            router.push("/");
            return;
        }
        setToken(storedToken);
    }, [router]);
    // Fetch favorites when token or activeTab changes
    useEffect(() => {
        if (!token)
            return;
        const fetchFavorites = async () => {
            setLoading(true);
            setError("");
            try {
                switch (activeTab) {
                    case "properties":
                        const propertiesData = await FavoritesAPI.getProperties();
                        setProperties(propertiesData.favorites || []);
                        break;
                    case "agents":
                        const agentsData = await FavoritesAPI.getAgents();
                        setAgents(agentsData.favorites || []);
                        break;
                    case "builders":
                        const buildersData = await FavoritesAPI.getBuilders();
                        if (buildersData.favorites && buildersData.favorites.length > 0) {
                            toast.info(`Loading details for ${buildersData.favorites.length} builders...`);
                            // Fetch detailed information for each builder
                            const builderDetailsPromises = buildersData.favorites.map(async (builder) => {
                                try {
                                    const response = await fetch(`/api/builders/${builder._id}`);
                                    if (response.ok) {
                                        const data = await response.json();
                                        return data.builder;
                                    }
                                    return builder; // Fall back to basic data if fetch fails
                                }
                                catch (error) {
                                    console.error(`Error fetching builder ${builder._id}:`, error);
                                    return builder; // Fall back to basic data if fetch fails
                                }
                            });
                            const detailedBuilders = await Promise.all(builderDetailsPromises);
                            setBuilders(detailedBuilders);
                        }
                        else {
                            setBuilders([]);
                        }
                        break;
                    case "projects":
                        const projectsData = await FavoritesAPI.getProjects();
                        setProjects(projectsData.favorites || []);
                        break;
                }
            }
            catch (_error) {
                setError("Failed to load favorites. Please try again later.");
                toast.error("Failed to load favorites. Please try again.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [token, activeTab]);
    const removeFromFavorites = async (type, id) => {
        try {
            toast.info(`Removing ${type} from favorites...`);
            switch (type) {
                case "property":
                    await FavoritesAPI.removeProperty(id);
                    setProperties(properties.filter((p) => p._id !== id));
                    toast.success(`Property removed from favorites`);
                    break;
                case "agent":
                    await FavoritesAPI.removeAgent(id);
                    setAgents(agents.filter((a) => a._id !== id));
                    toast.success(`Agent removed from favorites`);
                    break;
                case "builder":
                    await FavoritesAPI.removeBuilder(id);
                    setBuilders(builders.filter((b) => b._id !== id));
                    toast.success(`Builder removed from favorites`);
                    break;
                case "project":
                    await FavoritesAPI.removeProject(id);
                    setProjects(projects.filter((p) => p._id !== id));
                    toast.success(`Project removed from favorites`);
                    break;
            }
        }
        catch (_error) {
            setError(`Failed to remove ${type} from favorites. Please try again.`);
            toast.error(`Failed to remove ${type} from favorites. Please try again.`);
        }
    };
    return (<div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold text-orange-500 mb-6">
          My Favorites
        </motion.h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-gray-900 shadow-sm border border-gray-800 rounded-lg mr-2">
            <TabsTrigger value="properties" className={`flex items-center gap-2 py-2 rounded-lg transition-colors duration-300 ${activeTab === "properties" ? "bg-orange-500 text-white" : ""}`}>
              <HomeIcon size={16}/>
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${activeTab === "agents" ? "bg-orange-500 text-white" : ""}`}>
              <Users size={16}/>
              <span>Agents</span>
            </TabsTrigger>
            <TabsTrigger value="builders" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${activeTab === "builders" ? "bg-orange-500 text-white" : ""}`}>
              <Building size={16}/>
              <span>Builders</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${activeTab === "projects" ? "bg-orange-500 text-white" : ""}`}>
              <Building size={16}/>
              <span>Projects</span>
            </TabsTrigger>
          </TabsList>

          {loading ? (<div className="flex justify-center items-center h-64">
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="rounded-full h-12 w-12 border-b-2 border-orange-500"></motion.div>
            </div>) : error ? (<div className="bg-red-700 border border-red-600 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>) : (<>
              <TabsContent value="properties">
                {properties.length === 0 ? (<EmptyState type="properties"/>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (<PropertyCard key={property._id} property={property} onRemove={() => removeFromFavorites("property", property._id)}/>))}
                  </motion.div>)}
              </TabsContent>

              <TabsContent value="agents">
                {agents.length === 0 ? (<EmptyState type="agents"/>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (<AgentCard key={agent._id} agent={agent} onRemove={() => removeFromFavorites("agent", agent._id)}/>))}
                  </motion.div>)}
              </TabsContent>

              <TabsContent value="builders">
                {builders.length === 0 ? (<EmptyState type="builders"/>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {builders.map((builder) => (<BuilderCard key={builder._id} builder={builder} onRemove={() => removeFromFavorites("builder", builder._id)}/>))}
                  </motion.div>)}
              </TabsContent>

              <TabsContent value="projects">
                {projects.length === 0 ? (<EmptyState type="projects"/>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (<ProjectCard key={project._id} project={project} onRemove={() => removeFromFavorites("project", project._id)}/>))}
                  </motion.div>)}
              </TabsContent>
            </>)}
        </Tabs>
      </div>
      <Footer />
    </div>);
}
function EmptyState({ type }) {
    const messages = {
        properties: {
            title: "No favorite properties yet",
            description: "Start exploring properties and save your favorites here.",
            action: "Browse Properties",
            link: "/search",
            icon: <HomeIcon className="w-16 h-16 text-gray-500"/>,
        },
        agents: {
            title: "No favorite agents yet",
            description: "Discover real estate agents and add them to your favorites.",
            action: "Find Agents",
            link: "/agents",
            icon: <Users className="w-16 h-16 text-gray-500"/>,
        },
        builders: {
            title: "No favorite builders yet",
            description: "Explore builders and add them to your favorites.",
            action: "Explore Builders",
            link: "/builders",
            icon: <Building className="w-16 h-16 text-gray-500"/>,
        },
        projects: {
            title: "No favorite projects yet",
            description: "Discover real estate projects and add them to your favorites.",
            action: "Explore Projects",
            link: "/projects",
            icon: <Building className="w-16 h-16 text-gray-500"/>,
        },
    };
    const { title, description, action, link, icon } = messages[type];
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center py-16 bg-gray-900 border border-gray-700 rounded-lg shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-orange-500 mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 text-center max-w-md">{description}</p>
      <Link href={link}>
        <Button className="bg-orange-600">{action}</Button>
      </Link>
    </motion.div>);
}
function PropertyCard({ property, onRemove, }) {
    var _a, _b;
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden bg-gray-900 border border-gray-700 text-white">
        <div className="relative h-48 w-full">
          <Image src={((_a = property.images) === null || _a === void 0 ? void 0 : _a[0]) || "/images/property-placeholder.jpg"} alt={property.title} fill className="object-cover"/>
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={onRemove}>
            <Trash2 size={16}/>
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1 text-orange-500">
            {property.title}
          </CardTitle>
          <CardDescription className="flex items-center text-gray-400">
            <MapPin size={14} className="mr-1"/>
            {property.address.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-orange-500">
            ₹{(_b = property.price) === null || _b === void 0 ? void 0 : _b.toLocaleString()}
          </p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Area</p>
              <p className="font-medium text-gray-300">
                {property.area} sq.ft.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium text-gray-300">
                {property.propertyType}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/search/${property._id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>);
}
function AgentCard({ agent, onRemove, }) {
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gray-800 border border-gray-700 text-white">
        <div className="relative">
          <div className="h-48 bg-gray-700 flex items-center justify-center">
            {agent.image ? (<Image src={agent.image} alt={agent.name} width={150} height={150} className="rounded-full object-cover h-28 w-28"/>) : (<div className="h-28 w-28 rounded-full bg-gray-600 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-300"/>
              </div>)}
          </div>
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={onRemove}>
            <Trash2 size={16}/>
          </Button>
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-orange-500">{agent.name}</CardTitle>
          <CardDescription className="text-gray-400">
            {agent.agentInfo.agency || "Independent Agent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            {agent.agentInfo.experience} years experience
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-300">
              {agent.agentInfo.properties || 0}
            </span>{" "}
            properties sold
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href={`/agents/${agent._id}`}>
            <Button variant="outline">View Profile</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>);
}
function BuilderCard({ builder, onRemove, }) {
    const [imageError, setImageError] = useState(false);
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gray-800 border border-gray-700 text-white overflow-hidden hover:border-orange-500 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-900">
          <Image src={imageError ? "/images/builder-placeholder.jpg" : (builder.logo || "/images/builder-placeholder.jpg")} alt={builder.title} fill className="object-contain p-4" onError={() => setImageError(true)}/>
          <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100 transition-opacity" onClick={onRemove}>
            <Trash2 size={16}/>
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="text-center text-orange-500">
            {builder.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-gray-300">
            {builder.description || builder.about || "Premier building developer and constructor"}
          </CardDescription>
          <CardDescription className="text-center text-gray-400">
            {builder.established ? `Est. ${builder.established}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center flex-grow">
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (<svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= builder.rating ? "currentColor" : "none"} stroke={star <= builder.rating ? "none" : "currentColor"} className={`w-4 h-4 ${star <= builder.rating ? "text-orange-500" : "text-gray-500"}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                </svg>))}
            </div>
            <span className="text-orange-500">{builder.rating ? builder.rating.toFixed(1) : "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-900 p-2 rounded">
              <p className="text-xs text-gray-400">Projects</p>
              <p className="font-semibold">{builder.projects || 0}</p>
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <p className="text-xs text-gray-400">Completed</p>
              <p className="font-semibold">{builder.completed || 0}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-2 rounded mb-3">
            <p className="text-xs text-gray-400">Specialization</p>
            <p className="text-sm truncate">{builder.specialization || "Real Estate"}</p>
          </div>
          <p className="text-xs text-gray-400">
            {builder.headquarters ? `HQ: ${builder.headquarters}` : ""}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center mt-auto">
          <Link href={`/builders/${builder._id}`}>
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>);
}
function ProjectCard({ project, onRemove, }) {
    var _a, _b, _c;
    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(1)} Cr`;
        }
        else if (price >= 100000) {
            return `₹${(price / 100000).toFixed(1)} L`;
        }
        return `₹${price.toLocaleString()}`;
    };
    const getMinPrice = () => {
        if (project.unitTypes && project.unitTypes.length > 0) {
            return Math.min(...project.unitTypes.map(u => u.priceRange.min));
        }
        return 0;
    };
    const getMaxPrice = () => {
        if (project.unitTypes && project.unitTypes.length > 0) {
            return Math.max(...project.unitTypes.map(u => u.priceRange.max));
        }
        return 0;
    };
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gray-800 border border-gray-700 text-white overflow-hidden hover:border-orange-500 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-900">
          <Image src={((_a = project.projectImages) === null || _a === void 0 ? void 0 : _a[0]) || "/placeholder-project.jpg"} alt={project.projectName} fill className="object-cover"/>
          <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100 transition-opacity" onClick={onRemove}>
            <Trash2 size={16}/>
          </Button>
          {project.verified && (<div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              Verified
            </div>)}
        </div>
        <CardHeader>
          <CardTitle className="text-center text-orange-500 line-clamp-1">
            {project.projectName}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            <MapPin className="inline w-4 h-4 mr-1"/>
            {project.locality}, {project.city}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center flex-grow">
          <div className="mb-3">
            <p className="text-sm text-gray-300">{project.projectStage}</p>
            <p className="text-xs text-gray-500">{project.constructionStatus}</p>
          </div>
          
          <div className="bg-gray-900 p-3 rounded mb-3">
            <p className="text-sm font-medium text-orange-400">Price Range</p>
            <p className="text-lg font-bold text-white">
              {formatPrice(getMinPrice())} - {formatPrice(getMaxPrice())}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center">
              <p className="text-xs text-gray-400">Property Types</p>
              <p className="text-sm font-medium">{((_b = project.propertyTypesOffered) === null || _b === void 0 ? void 0 : _b.length) || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Unit Types</p>
              <p className="text-sm font-medium">{((_c = project.unitTypes) === null || _c === void 0 ? void 0 : _c.length) || 0}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Expected Possession: {new Date(project.possessionDate).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center mt-auto">
          <Link href={`/projects/${project._id}`}>
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>);
}
