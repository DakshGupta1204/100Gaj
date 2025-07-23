"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import PropertyForm from "@/app/components/ui/propertyform";
import { motion } from "framer-motion";
export default function EditPropertyPage({ params }) {
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [propertyId, setPropertyId] = useState('');
    // Resolve params
    useEffect(() => {
        async function resolveParams() {
            const resolvedParams = await params;
            setPropertyId(resolvedParams.id);
        }
        resolveParams();
    }, [params]);
    useEffect(() => {
        const fetchProperty = async () => {
            var _a, _b;
            if (!propertyId)
                return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/properties/${propertyId}`);
                setProperty(response.data);
                setError("");
            }
            catch (err) {
                setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Failed to load property data");
                toast.error("Failed to load property data. Please try again.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [propertyId]);
    const handleFormClose = () => {
        router.push("/profile");
    };
    const handleFormSubmit = async () => {
        var _a, _b;
        try {
            // The property form component has already made the API call to update the property
            // We just need to handle the successful response
            toast.success("Property updated successfully!");
            // Navigate back to the profile page
            router.push("/profile");
        }
        catch (err) {
            toast.error(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "An error occurred while updating the property");
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>);
    }
    if (error) {
        return (<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="text-3xl font-bold text-orange-500 mb-4">Error Loading Property</h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <button onClick={() => router.push("/profile")} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              Back to Profile
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-orange-500">Edit Property</h1>
          <p className="text-gray-300 mt-2">Update your property details below</p>
        </motion.div>

        {property && (<PropertyForm onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={property} isEditing={true}/>)}
      </div>
      <Footer />
    </div>);
}
