"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Home, Building, Store, LandPlot, CheckCircle, Camera, X, ArrowLeft, ArrowRight, Sparkles, MapPin, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
const propertyTypes = [
    {
        value: "apartment",
        label: "Apartment",
        icon: <Building className="w-5 h-5"/>,
        subTypes: ["Studio Apartment", "Builder Floor", "Service Apartment", "Penthouse"]
    },
    {
        value: "house",
        label: "Independent House",
        icon: <Home className="w-5 h-5"/>,
        subTypes: ["Villa", "Row House", "Bungalow", "Farmhouse"]
    },
    {
        value: "villa",
        label: "Villa",
        icon: <Home className="w-5 h-5"/>,
        subTypes: ["Independent Villa", "Villa in Complex", "Resort Villa"]
    },
    {
        value: "commercial",
        label: "Commercial",
        icon: <Store className="w-5 h-5"/>,
        subTypes: ["Shop", "Office Space", "Showroom", "Warehouse", "Restaurant Space"]
    },
    {
        value: "land",
        label: "Plot/Land",
        icon: <LandPlot className="w-5 h-5"/>,
        subTypes: ["Residential Plot", "Commercial Plot", "Agricultural Land", "Industrial Plot"]
    },
];
const amenities = [
    "Parking",
    "Swimming Pool",
    "Gym",
    "Security",
    "Garden",
    "Elevator",
    "Power Backup",
    "Club House",
    "Air Conditioning",
    "Furnished",
    "Balcony",
    "Pet Friendly",
    "CCTV",
    "Intercom",
    "Fire Safety",
    "Water Storage",
    "Maintenance Staff",
    "Visitor Parking",
    "Children's Play Area",
    "Senior Citizen Sit-out"
];
// Delhi areas for locality dropdown
const delhiAreas = [
    "ANAND PARBAT", "BARAKHAMBA ROAD", "CHANAKYAPURI", "CHANDNI MAHAL", "CONNAUGHT PLACE", "D.B.G ROAD",
    "DARYA GANJ", "DELHI CANTT", "FARASH BAZAR", "H. N. DIN", "HAUZQAZI", "I.P. ESTATE", "INDERPURI",
    "JAMA MASJID", "KAMLA MARKET", "KAROL BAGH", "KASHMERE GATE", "KIRTI NAGAR", "LAHORI GATE",
    "MANDIR MARG", "NABI KARIM", "NARAINA", "PAHARGANJ", "PARLIAMENT STREET", "PARSHAD NAGAR",
    "PATEL NAGAR", "RAJINDER NAGAR", "RANJIT NAGAR", "SADAR BAZAR", "SAROJINI NAGAR", "SUBZIMANDI",
    "TILAK MARG", "TUGLAK ROAD", "ANANDVIHAR", "GANDHI NAGAR", "GEETA COLONY", "GHAZIPUR",
    "JAFFARPUR KALAN", "JAGATPURI", "KALYANPURI", "KANJHAWLA", "KARKARDOOMA", "LAXMI NAGAR",
    "MAYUR VIHAR", "NAND NAGRI", "PANDAV NAGAR", "PATPARGANJ", "PREET VIHAR", "SEELAMPUR",
    "SHAHDARA", "SHASTRI PARK", "SUNDAR NAGRI", "TRILOKPURI", "VASUNDHARA ENCLAVE", "VIVEK VIHAR",
    "YAMUNA VIHAR", "ADARSH NAGAR", "ALIPUR", "AZADPUR", "BAWANA", "BHALSWA JAHANGIR PUR", "BURARI",
    "JAHANGIR PURI", "KESHAV PURAM", "KOTWALI", "LAWRENCE ROAD", "MAURYA ENCLAVE", "MODEL TOWN",
    "NARELA", "NETAJI SUBHASH PLACE", "PRASHANT VIHAR", "PULPAHLADPUR", "ROHINI", "SABZI MANDI",
    "SARAI ROHILLA", "SHAKURPUR", "TRI NAGAR", "WAZIRPUR", "AMBEDKAR NAGAR", "ANDREWS GANJ",
    "BADARPUR", "CHITTARANJAN PARK", "DEFENCE COLONY", "FRIENDS COLONY", "GOVINDPURI",
    "GREATER KAILASH", "HAUZ KHAS", "JANGPURA", "KALKAJI", "KOTLA MUBARAKPUR", "LAJPAT NAGAR",
    "LODHI ROAD", "MALVIYA NAGAR", "MEHRAULI", "NEHRU PLACE", "NEW FRIENDS COLONY", "OKHLA",
    "R. K. PURAM", "SAKET", "SARITA VIHAR", "SHEIKH SARAI", "SOUTH EXTENSION", "TIGRI",
    "TUGLAKABAD", "VASANT KUNJ", "VASANT VIHAR", "AAYA NAGAR", "BINDAPUR", "CHHAWLA", "DABRI",
    "DWARKA", "HASTSAL", "JANAKPURI", "KAKROLA", "KAPASHERA", "MOHAN GARDEN", "NAJAFGARH",
    "PALAM", "POCHANPUR", "SADH NAGAR", "SAGARPUR", "UTTAM NAGAR", "VASANT KUNJ", "VIKASPURI",
    "BIJWASAN", "BRAHMPURI", "HARI NAGAR", "JANAKPURI", "KANJHAWLA", "KHYALA", "MATIALA",
    "MAYAPURI", "MUNDKA", "NANGLOI", "NIHAL VIHAR", "PASCHIM VIHAR", "PEERAGARHI", "PUNJABI BAGH",
    "RAJOURI GARDEN", "RANHAULA", "SUBHASH NAGAR", "TAGORE GARDEN", "TILAK NAGAR", "VIKAS PURI"
].sort();
const bhkOptions = [
    "Studio", "1 RK", "1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK",
    "4 BHK", "4.5 BHK", "5 BHK", "5+ BHK"
];
const furnishingOptions = [
    "Unfurnished", "Semi-Furnished", "Fully Furnished"
];
const propertyAgeOptions = [
    "New Construction", "Less than 1 year", "1-5 years", "5-10 years", "10-15 years", "15+ years"
];
const possessionStatusOptions = [
    "Ready to Move", "Under Construction"
];
const facingOptions = [
    "North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"
];
const parkingOptions = [
    "No Parking", "1 Covered", "2 Covered", "3+ Covered", "1 Open", "2 Open", "3+ Open", "1 Covered + 1 Open"
];
const waterElectricityOptions = [
    "24x7 Available", "Limited Hours", "Frequent Cuts", "No Issues"
];
const ownershipTypeOptions = [
    "Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"
];
async function generateAIDescription(propertyData) {
    var _a, _b, _c, _d, _e, _f;
    const API_URL = "https://api.together.xyz/v1/completions";
    const API_KEY = process.env.NEXT_PUBLIC_TOGETHER_API_KEY || "";
    if (!API_KEY) {
        throw new Error("Together API key is not set");
    }
    const amenitiesText = ((_a = propertyData.amenities) === null || _a === void 0 ? void 0 : _a.length) > 0
        ? `Amenities: ${propertyData.amenities.join(", ")}.`
        : "";
    const bedroomsText = propertyData.bedrooms
        ? `${propertyData.bedrooms}`
        : "";
    const bathroomsText = propertyData.bathrooms
        ? `${propertyData.bathrooms} bathroom${propertyData.bathrooms > 1 ? "s" : ""}`
        : "";
    const roomsText = bedroomsText && bathroomsText
        ? `${bedroomsText} with ${bathroomsText}`
        : bedroomsText || bathroomsText;
    const locationText = ((_b = propertyData.address) === null || _b === void 0 ? void 0 : _b.city)
        ? `located in ${((_c = propertyData.address) === null || _c === void 0 ? void 0 : _c.locality) || ""} ${((_d = propertyData.address) === null || _d === void 0 ? void 0 : _d.locality) ? "," : ""} ${(_e = propertyData.address) === null || _e === void 0 ? void 0 : _e.city}`
        : "";
    const prompt = `Write a compelling real estate property description for the following property:

  Property Title: ${propertyData.title}
  Property Type: ${propertyData.propertyType}${propertyData.subType ? ` (${propertyData.subType})` : ""}
  ${roomsText ? `Configuration: ${roomsText}` : ""}
  Size: ${propertyData.area} square feet
  ${locationText ? `Location: ${locationText}` : ""}
  Listing Type: ${propertyData.listingType}
  Furnishing: ${propertyData.furnishing || ""}
  ${amenitiesText}

  Write a professional and engaging description highlighting the property's features and benefits. Keep it under 150 words, focus on selling points, and make it appealing to potential ${propertyData.listingType === 'rent' ? 'tenants' : 'buyers'}. Do not include the price. Don't include any markdown or formatting tags, just provide the plain text description. Write the description directly without any preamble.

  Description:`;
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
                prompt: prompt,
                max_tokens: 256,
                temperature: 0.7,
                top_p: 0.9,
                stop: ["</s>", "[/INST]"],
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to generate description");
        }
        const data = await response.json();
        let generatedText = ((_f = data.choices[0]) === null || _f === void 0 ? void 0 : _f.text) || "";
        generatedText = generatedText.trim();
        if (generatedText.startsWith("Description:")) {
            generatedText = generatedText.replace("Description:", "").trim();
        }
        return generatedText;
    }
    catch (error) {
        console.error("Error generating AI description:", error);
        return "";
    }
}
export default function EnhancedPropertyForm({ onClose, onSubmit, initialData = null, isEditing = false, }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Property Details
        title: (initialData === null || initialData === void 0 ? void 0 : initialData.title) || "",
        listingType: (initialData === null || initialData === void 0 ? void 0 : initialData.listingType) || "sale",
        propertyType: (initialData === null || initialData === void 0 ? void 0 : initialData.propertyType) || "",
        subType: (initialData === null || initialData === void 0 ? void 0 : initialData.subType) || "",
        bedrooms: (initialData === null || initialData === void 0 ? void 0 : initialData.bedrooms) ? String(initialData.bedrooms) : "",
        furnishing: (initialData === null || initialData === void 0 ? void 0 : initialData.furnishing) || "",
        propertyAge: (initialData === null || initialData === void 0 ? void 0 : initialData.propertyAge) || "",
        possessionStatus: (initialData === null || initialData === void 0 ? void 0 : initialData.possessionStatus) || "",
        availableFrom: (initialData === null || initialData === void 0 ? void 0 : initialData.availableFrom) || "",
        // Step 2: Location & Address
        address: {
            city: ((_a = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _a === void 0 ? void 0 : _a.city) || "Delhi",
            locality: ((_b = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _b === void 0 ? void 0 : _b.locality) || "",
            projectName: ((_c = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _c === void 0 ? void 0 : _c.projectName) || "",
            street: ((_d = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _d === void 0 ? void 0 : _d.street) || "",
            floorNumber: ((_e = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _e === void 0 ? void 0 : _e.floorNumber) || "",
            landmark: ((_f = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _f === void 0 ? void 0 : _f.landmark) || "",
            coordinates: {
                latitude: ((_h = (_g = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _g === void 0 ? void 0 : _g.location) === null || _h === void 0 ? void 0 : _h.coordinates)
                    ? String((_k = (_j = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _j === void 0 ? void 0 : _j.location) === null || _k === void 0 ? void 0 : _k.coordinates[1])
                    : "",
                longitude: ((_m = (_l = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _l === void 0 ? void 0 : _l.location) === null || _m === void 0 ? void 0 : _m.coordinates)
                    ? String((_p = (_o = initialData === null || initialData === void 0 ? void 0 : initialData.address) === null || _o === void 0 ? void 0 : _o.location) === null || _p === void 0 ? void 0 : _p.coordinates[0])
                    : "",
            },
        },
        // Step 3: Property Features & Area
        area: (initialData === null || initialData === void 0 ? void 0 : initialData.area) ? String(initialData.area) : "",
        carpetArea: (initialData === null || initialData === void 0 ? void 0 : initialData.carpetArea) ? String(initialData.carpetArea) : "",
        bathrooms: (initialData === null || initialData === void 0 ? void 0 : initialData.bathrooms) ? String(initialData.bathrooms) : "",
        balconyCount: (initialData === null || initialData === void 0 ? void 0 : initialData.balconyCount) ? String(initialData.balconyCount) : "",
        facing: (initialData === null || initialData === void 0 ? void 0 : initialData.facing) || "",
        parking: (initialData === null || initialData === void 0 ? void 0 : initialData.parking) || "",
        waterElectricity: (initialData === null || initialData === void 0 ? void 0 : initialData.waterElectricity) || "",
        description: (initialData === null || initialData === void 0 ? void 0 : initialData.description) || "",
        // Step 4: Pricing & Media
        price: (initialData === null || initialData === void 0 ? void 0 : initialData.price) ? String(initialData.price) : "",
        priceNegotiable: (initialData === null || initialData === void 0 ? void 0 : initialData.priceNegotiable) || false,
        maintenanceCharges: (initialData === null || initialData === void 0 ? void 0 : initialData.maintenanceCharges) ? String(initialData.maintenanceCharges) : "",
        securityDeposit: (initialData === null || initialData === void 0 ? void 0 : initialData.securityDeposit) ? String(initialData.securityDeposit) : "",
        images: [],
        existingImages: (initialData === null || initialData === void 0 ? void 0 : initialData.images) || [],
        floorPlan: null,
        virtualTour: (initialData === null || initialData === void 0 ? void 0 : initialData.virtualTour) || "",
        ownershipType: (initialData === null || initialData === void 0 ? void 0 : initialData.ownershipType) || "",
        // Step 5: Contact Information  
        ownerDetails: {
            name: ((_q = initialData === null || initialData === void 0 ? void 0 : initialData.ownerDetails) === null || _q === void 0 ? void 0 : _q.name) || "",
            phone: ((_r = initialData === null || initialData === void 0 ? void 0 : initialData.ownerDetails) === null || _r === void 0 ? void 0 : _r.phone) || "",
            email: ((_s = initialData === null || initialData === void 0 ? void 0 : initialData.ownerDetails) === null || _s === void 0 ? void 0 : _s.email) || "",
        },
        amenities: (initialData === null || initialData === void 0 ? void 0 : initialData.amenities) || [],
    });
    const [imagePreviewUrls, setImagePreviewUrls] = useState((initialData === null || initialData === void 0 ? void 0 : initialData.images) || []);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
    const getSubTypes = () => {
        const selectedType = propertyTypes.find(type => type.value === formData.propertyType);
        return (selectedType === null || selectedType === void 0 ? void 0 : selectedType.subTypes) || [];
    };
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => (Object.assign(Object.assign({}, prev), { [parent]: Object.assign(Object.assign({}, prev[parent]), { [child]: type === 'number' ? parseFloat(value) || 0 : value }) })));
        }
        else {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseFloat(value) || 0 : value })));
        }
    };
    const handleNestedInputChange = (parent, child, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [parent]: Object.assign(Object.assign({}, prev[parent]), { [child]: value }) })));
    };
    const handleAmenityChange = (amenity) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity] })));
    };
    const handlePropertyTypeChange = (type) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { propertyType: type, subType: "" })));
    };
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => (Object.assign(Object.assign({}, prev), { images: [...prev.images, ...files] })));
        const newPreviewUrls = await Promise.all(files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => { var _a; return resolve((_a = e.target) === null || _a === void 0 ? void 0 : _a.result); };
                reader.readAsDataURL(file);
            });
        }));
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        setFormData(prev => (Object.assign(Object.assign({}, prev), { images: [...prev.images, ...imageFiles] })));
        const newPreviewUrls = await Promise.all(imageFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => { var _a; return resolve((_a = e.target) === null || _a === void 0 ? void 0 : _a.result); };
                reader.readAsDataURL(file);
            });
        }));
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };
    const removeImage = (index, isExisting = false) => {
        if (isExisting) {
            setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
            setFormData(prev => (Object.assign(Object.assign({}, prev), { existingImages: prev.existingImages.filter((_, i) => i !== index) })));
        }
        else {
            const newImageIndex = index - formData.existingImages.length;
            setFormData(prev => (Object.assign(Object.assign({}, prev), { images: prev.images.filter((_, i) => i !== newImageIndex) })));
            setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        }
    };
    // Validation function for each step
    const validateStep = (step) => {
        var _a, _b;
        const errors = [];
        switch (step) {
            case 1: // Basic Property Details
                if (!formData.title.trim())
                    errors.push("Property title is required");
                if (!formData.listingType)
                    errors.push("Listing type is required");
                if (!formData.propertyType)
                    errors.push("Property type is required");
                if (!formData.furnishing)
                    errors.push("Furnishing status is required");
                if (!formData.possessionStatus)
                    errors.push("Possession status is required");
                break;
            case 2: // Location & Address
                if (!formData.address.city.trim())
                    errors.push("City is required");
                if (!formData.address.locality.trim())
                    errors.push("Locality is required");
                if (!formData.address.street.trim())
                    errors.push("Street address is required");
                if (!formData.address.coordinates.latitude || !formData.address.coordinates.longitude) {
                    errors.push("Coordinates are required - please fetch coordinates");
                }
                break;
            case 3: // Property Features & Area
                if (!formData.area || parseFloat(formData.area) <= 0)
                    errors.push("Valid area is required");
                if (!formData.description.trim())
                    errors.push("Property description is required");
                break;
            case 4: // Pricing & Media
                if (!formData.price || parseFloat(formData.price) <= 0)
                    errors.push("Valid price is required");
                // Check if images exist (either new uploads or existing images)
                const totalImages = (((_a = formData.existingImages) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = formData.images) === null || _b === void 0 ? void 0 : _b.length) || 0);
                if (totalImages === 0) {
                    errors.push("At least one image is required");
                }
                break;
            case 5: // Contact Information
                if (!formData.ownerDetails.name.trim())
                    errors.push("Owner name is required");
                if (!formData.ownerDetails.phone.trim())
                    errors.push("Owner phone is required");
                if (!formData.ownerDetails.email.trim())
                    errors.push("Owner email is required");
                break;
        }
        return { isValid: errors.length === 0, errors };
    };
    // Helper function to check if current step is valid
    const isCurrentStepValid = () => {
        const validation = validateStep(formStep);
        return validation.isValid;
    };
    const handleNextStep = () => {
        const validation = validateStep(formStep);
        if (!validation.isValid) {
            toast.error(`Please fill required fields: ${validation.errors.join(", ")}`);
            return;
        }
        if (formStep < 5) {
            setFormStep(formStep + 1);
        }
    };
    const handlePrevStep = () => {
        if (formStep > 1) {
            setFormStep(formStep - 1);
        }
    };
    const fetchCoordinates = async () => {
        if (!formData.address.locality || !formData.address.city)
            return;
        setIsLoadingCoordinates(true);
        try {
            const query = `${formData.address.locality}, ${formData.address.city}, India`;
            const response = await axios.get(`/api/geocode?q=${encodeURIComponent(query)}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setFormData(prev => (Object.assign(Object.assign({}, prev), { address: Object.assign(Object.assign({}, prev.address), { coordinates: {
                            latitude: String(lat),
                            longitude: String(lon),
                        } }) })));
                toast.success("Coordinates fetched successfully!");
            }
            else {
                toast.error("Could not find coordinates for this locality");
            }
        }
        catch (error) {
            toast.error("Failed to fetch coordinates");
        }
        finally {
            setIsLoadingCoordinates(false);
        }
    };
    const handleGenerateAIDescription = async () => {
        setIsGeneratingDescription(true);
        try {
            const description = await generateAIDescription(formData);
            if (description) {
                setFormData(prev => (Object.assign(Object.assign({}, prev), { description })));
                toast.success("AI description generated!");
            }
            else {
                toast.error("Failed to generate description. Please write manually.");
            }
        }
        catch (error) {
            toast.error("Failed to generate description. Please write manually.");
        }
        finally {
            setIsGeneratingDescription(false);
        }
    };
    const uploadImages = async (images) => {
        const uploadPromises = images.map(async (image) => {
            const formDataUpload = new FormData();
            formDataUpload.append("file", image);
            formDataUpload.append("fileName", `property-${Date.now()}-${image.name}`);
            formDataUpload.append("folder", "/properties");
            try {
                const response = await axios.post("/api/upload", formDataUpload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return response.data.url;
            }
            catch (error) {
                console.error("Error uploading image:", error);
                throw error;
            }
        });
        return Promise.all(uploadPromises);
    };
    // Helper function to convert parking string to number
    const parseParkingValue = (parkingStr) => {
        if (parkingStr === "No Parking")
            return 0;
        if (parkingStr === "1 Covered" || parkingStr === "1 Open")
            return 1;
        if (parkingStr === "2 Covered" || parkingStr === "2 Open")
            return 2;
        if (parkingStr === "3+ Covered" || parkingStr === "3+ Open")
            return 3;
        if (parkingStr === "1 Covered + 1 Open")
            return 2;
        return 0; // Default fallback
    };
    // Validation function
    const validateForm = () => {
        var _a, _b;
        const errors = [];
        if (!formData.title.trim())
            errors.push("Title is required");
        if (!formData.description.trim())
            errors.push("Description is required");
        if (!formData.price || parseFloat(formData.price) <= 0)
            errors.push("Valid price is required");
        if (!formData.propertyType)
            errors.push("Property type is required");
        if (!formData.listingType)
            errors.push("Listing type is required");
        if (!formData.area || parseFloat(formData.area) <= 0)
            errors.push("Valid area is required");
        if (!formData.address.street.trim())
            errors.push("Street address is required");
        if (!formData.address.locality.trim())
            errors.push("Locality is required");
        if (!formData.address.city.trim())
            errors.push("City is required");
        if (!formData.ownerDetails.name.trim())
            errors.push("Owner name is required");
        if (!formData.ownerDetails.phone.trim())
            errors.push("Owner phone is required");
        if (!formData.ownerDetails.email.trim())
            errors.push("Owner email is required");
        if (!formData.address.coordinates.latitude || !formData.address.coordinates.longitude) {
            errors.push("Coordinates are required - please fetch coordinates");
        }
        // Check if images exist (either new uploads or existing images)
        const totalImages = (((_a = formData.existingImages) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = formData.images) === null || _b === void 0 ? void 0 : _b.length) || 0);
        if (totalImages === 0) {
            errors.push("At least one image is required");
        }
        return errors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form before submission
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.error(`Please fix the following errors: ${validationErrors.join(", ")}`);
            return;
        }
        setIsSubmitting(true);
        try {
            // Upload new images
            const newImageUrls = formData.images.length > 0
                ? await uploadImages(formData.images)
                : [];
            const allImageUrls = [...formData.existingImages, ...newImageUrls];
            // Prepare submission data
            const submissionData = Object.assign(Object.assign({}, formData), { images: allImageUrls, price: parseFloat(formData.price), area: parseFloat(formData.area), carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : undefined, bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined, bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined, balconyCount: formData.balconyCount ? parseInt(formData.balconyCount) : undefined, parking: formData.parking ? parseParkingValue(formData.parking) : 0, maintenanceCharges: formData.maintenanceCharges ? parseFloat(formData.maintenanceCharges) : undefined, securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : undefined, address: Object.assign(Object.assign({}, formData.address), { state: 'Delhi', zipCode: '110001', country: 'India', location: {
                        type: 'Point',
                        coordinates: [
                            parseFloat(formData.address.coordinates.longitude),
                            parseFloat(formData.address.coordinates.latitude)
                        ]
                    } }) });
            await onSubmit(submissionData);
            onClose();
        }
        catch (error) {
            console.error("Error submitting property:", error);
            toast.error("Failed to submit property. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Auto-fetch coordinates when locality changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.address.locality && formData.address.city) {
                fetchCoordinates();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData.address.locality, formData.address.city]);
    return (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-black border border-orange-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-500/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-orange-500"/>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Edit Property" : "Post Property"}
              </h2>
              <p className="text-gray-300">Step {formStep} of 5</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-500/20 rounded-full transition-colors">
            <X className="w-6 h-6 text-white"/>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-orange-500/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (<div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step <= formStep
                ? "bg-orange-500 text-black"
                : "bg-gray-700 text-gray-400"}`}>
                  {step}
                </div>
                {step < 5 && (<div className={`w-16 h-1 mx-2 ${step < formStep ? "bg-orange-500" : "bg-gray-700"}`}/>)}
              </div>))}
          </div>
          <div className="text-sm text-gray-300">
            {formStep === 1 && "Basic Property Details"}
            {formStep === 2 && "Location & Address"}
            {formStep === 3 && "Property Features & Area"}
            {formStep === 4 && "Pricing & Media"}
            {formStep === 5 && "Contact Information"}
          </div>
          
          {/* Validation Status */}
          {!isCurrentStepValid() && (<div className="text-xs text-red-400 mt-1">
              ⚠️ Please fill all required fields to proceed
            </div>)}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto bg-black text-white flex-1 min-h-0">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Property Details */}
              {formStep === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., 2 BHK Flat in Sector 62" required/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="listingType">Listing Type *</Label>
                      <Select value={formData.listingType} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { listingType: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">Sell</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select value={formData.propertyType} onValueChange={handlePropertyTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type"/>
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (<SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.propertyType && getSubTypes().length > 0 && (<div>
                      <Label htmlFor="subType">Sub-Type</Label>
                      <Select value={formData.subType} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { subType: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-type"/>
                        </SelectTrigger>
                        <SelectContent>
                          {getSubTypes().map((subType) => (<SelectItem key={subType} value={subType}>
                              {subType}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>)}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(formData.propertyType !== 'land' && formData.propertyType !== 'commercial') && (<div>
                        <Label htmlFor="bedrooms">BHK/Room Count *</Label>
                        <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { bedrooms: value })))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select BHK"/>
                          </SelectTrigger>
                          <SelectContent>
                            {bhkOptions.map((bhk) => (<SelectItem key={bhk} value={bhk}>
                                {bhk}
                              </SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>)}

                    <div>
                      <Label htmlFor="furnishing">Furnishing *</Label>
                      <Select value={formData.furnishing} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { furnishing: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing"/>
                        </SelectTrigger>
                        <SelectContent>
                          {furnishingOptions.map((option) => (<SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="propertyAge">Property Age *</Label>
                      <Select value={formData.propertyAge} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { propertyAge: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property age"/>
                        </SelectTrigger>
                        <SelectContent>
                          {propertyAgeOptions.map((option) => (<SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="possessionStatus">Possession Status *</Label>
                      <Select value={formData.possessionStatus} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { possessionStatus: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select possession status"/>
                        </SelectTrigger>
                        <SelectContent>
                          {possessionStatusOptions.map((option) => (<SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input id="availableFrom" name="availableFrom" value={formData.availableFrom} onChange={handleInputChange} type="date"/>
                  </div>
                </motion.div>)}

              {/* Step 2: Location & Address */}
              {formStep === 2 && (<motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="address.city">City *</Label>
                      <Select value={formData.address.city} onValueChange={(value) => handleNestedInputChange('address', 'city', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="address.locality">Locality/Sector *</Label>
                      <Select value={formData.address.locality} onValueChange={(value) => handleNestedInputChange('address', 'locality', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select locality"/>
                        </SelectTrigger>
                        <SelectContent>
                          {delhiAreas.map((area) => (<SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address.projectName">Project/Society Name</Label>
                    <Input id="address.projectName" name="address.projectName" value={formData.address.projectName} onChange={handleInputChange} placeholder="Optional, but useful"/>
                  </div>

                  <div>
                    <Label htmlFor="address.street">Full Address *</Label>
                    <Textarea id="address.street" name="address.street" value={formData.address.street} onChange={handleInputChange} placeholder="Complete address" rows={3} required/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="address.floorNumber">Floor Number</Label>
                      <Input id="address.floorNumber" name="address.floorNumber" value={formData.address.floorNumber} onChange={handleInputChange} placeholder="e.g., 2nd out of 10"/>
                    </div>

                    <div>
                      <Label htmlFor="address.landmark">Landmark</Label>
                      <Input id="address.landmark" name="address.landmark" value={formData.address.landmark} onChange={handleInputChange} placeholder="Optional"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="address.coordinates.latitude">Latitude</Label>
                      <div className="flex gap-2">
                        <Input id="address.coordinates.latitude" name="address.coordinates.latitude" value={formData.address.coordinates.latitude} onChange={handleInputChange} placeholder="Auto-generated" readOnly/>
                        <Button type="button" variant="outline" onClick={fetchCoordinates} disabled={isLoadingCoordinates} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                          <MapPin className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address.coordinates.longitude">Longitude</Label>
                      <Input id="address.coordinates.longitude" name="address.coordinates.longitude" value={formData.address.coordinates.longitude} onChange={handleInputChange} placeholder="Auto-generated" readOnly/>
                    </div>
                  </div>
                </motion.div>)}

              {/* Step 3: Property Features & Area */}
              {formStep === 3 && (<motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="area">Super Built-up Area (sqft) *</Label>
                      <Input id="area" name="area" value={formData.area} onChange={handleInputChange} placeholder="Enter area in sqft" type="number" required/>
                    </div>

                    <div>
                      <Label htmlFor="carpetArea">Carpet Area (sqft)</Label>
                      <Input id="carpetArea" name="carpetArea" value={formData.carpetArea} onChange={handleInputChange} placeholder="Optional" type="number"/>
                    </div>
                  </div>

                  {(formData.propertyType !== 'land') && (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="bathrooms">No. of Bathrooms *</Label>
                        <Select value={formData.bathrooms} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { bathrooms: value })))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (<SelectItem key={num} value={String(num)}>
                                {num}
                              </SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="balconyCount">Balcony Count</Label>
                        <Select value={formData.balconyCount} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { balconyCount: value })))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map((num) => (<SelectItem key={num} value={String(num)}>
                                {num}
                              </SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="facing">Facing</Label>
                        <Select value={formData.facing} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { facing: value })))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facing"/>
                          </SelectTrigger>
                          <SelectContent>
                            {facingOptions.map((option) => (<SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>)}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="parking">Parking Availability *</Label>
                      <Select value={formData.parking} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { parking: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parking"/>
                        </SelectTrigger>
                        <SelectContent>
                          {parkingOptions.map((option) => (<SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="waterElectricity">Water & Electricity Supply *</Label>
                      <Select value={formData.waterElectricity} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { waterElectricity: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability"/>
                        </SelectTrigger>
                        <SelectContent>
                          {waterElectricityOptions.map((option) => (<SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="description">Property Description *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateAIDescription} disabled={isGeneratingDescription} className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                        <Sparkles className="w-4 h-4"/>
                        {isGeneratingDescription ? "Generating..." : "AI Generate"}
                      </Button>
                    </div>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Highlight condition, view, facilities" rows={4} required/>
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {amenities.map((amenity) => (<div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={amenity} checked={formData.amenities.includes(amenity)} onCheckedChange={() => handleAmenityChange(amenity)}/>
                          <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                        </div>))}
                    </div>
                  </div>
                </motion.div>)}

              {/* Step 4: Pricing & Media */}
              {formStep === 4 && (<motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price">
                        Expected {formData.listingType === 'rent' ? 'Rent' : 'Price'} *
                      </Label>
                      <Input id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder={formData.listingType === 'rent' ? "Monthly rent" : "Total amount"} type="number" required/>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox id="priceNegotiable" checked={formData.priceNegotiable} onCheckedChange={(checked) => setFormData(prev => (Object.assign(Object.assign({}, prev), { priceNegotiable: checked })))}/>
                      <Label htmlFor="priceNegotiable">Price Negotiable</Label>
                    </div>
                  </div>

                  {formData.listingType === 'rent' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="maintenanceCharges">Maintenance Charges (Monthly)</Label>
                        <Input id="maintenanceCharges" name="maintenanceCharges" value={formData.maintenanceCharges} onChange={handleInputChange} placeholder="Optional" type="number"/>
                      </div>

                      <div>
                        <Label htmlFor="securityDeposit">Security Deposit</Label>
                        <Input id="securityDeposit" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} placeholder="Optional" type="number"/>
                      </div>
                    </div>)}

                  {formData.listingType === 'sale' && (<div>
                      <Label htmlFor="ownershipType">Ownership Type</Label>
                      <Select value={formData.ownershipType} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { ownershipType: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ownership type"/>
                        </SelectTrigger>
                        <SelectContent>
                          {ownershipTypeOptions.map((option) => (<SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>)}

                  <div>
                    <Label>Upload Property Photos *</Label>
                    <div className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? "border-orange-500 bg-orange-500/10" : "border-orange-500/30"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                      <Camera className="w-12 h-12 text-orange-500 mx-auto mb-4"/>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          Drag and drop images here or click to browse
                        </p>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="property-images"/>
                        <Button type="button" variant="outline" onClick={() => { var _a; return (_a = document.getElementById('property-images')) === null || _a === void 0 ? void 0 : _a.click(); }} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                          Choose Images
                        </Button>
                      </div>
                    </div>
                    
                    {imagePreviewUrls.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {imagePreviewUrls.map((url, index) => (<div key={index} className="relative">
                            <Image src={url} alt={`Property ${index + 1}`} width={200} height={150} className="w-full h-32 object-cover rounded-lg"/>
                            <button type="button" onClick={() => removeImage(index, index < formData.existingImages.length)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                              <X className="w-4 h-4"/>
                            </button>
                          </div>))}
                      </div>)}
                  </div>

                  <div>
                    <Label htmlFor="virtualTour">Virtual Tour/YouTube Video (Optional)</Label>
                    <Input id="virtualTour" name="virtualTour" value={formData.virtualTour} onChange={handleInputChange} placeholder="YouTube or tour URL"/>
                  </div>
                </motion.div>)}

              {/* Step 5: Contact Information */}
              {formStep === 5 && (<motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="ownerDetails.name">Name *</Label>
                      <Input id="ownerDetails.name" name="ownerDetails.name" value={formData.ownerDetails.name} onChange={handleInputChange} placeholder="Your full name" required/>
                    </div>

                    <div>
                      <Label htmlFor="ownerDetails.phone">Phone Number *</Label>
                      <Input id="ownerDetails.phone" name="ownerDetails.phone" value={formData.ownerDetails.phone} onChange={handleInputChange} placeholder="+91 9876543210" required/>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ownerDetails.email">Email *</Label>
                    <Input id="ownerDetails.email" name="ownerDetails.email" value={formData.ownerDetails.email} onChange={handleInputChange} placeholder="your.email@example.com" type="email" required/>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-500 mb-2">Review Your Property</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong className="text-white">Title:</strong> {formData.title}</p>
                      <p><strong className="text-white">Type:</strong> {formData.propertyType} {formData.subType && `(${formData.subType})`}</p>
                      <p><strong className="text-white">Location:</strong> {formData.address.locality}, {formData.address.city}</p>
                      <p><strong className="text-white">Area:</strong> {formData.area} sqft</p>
                      <p><strong className="text-white">Price:</strong> ₹{formData.price} {formData.listingType === 'rent' ? '/month' : ''}</p>
                      <p><strong className="text-white">Images:</strong> {formData.images.length + formData.existingImages.length} uploaded</p>
                    </div>
                  </div>
                </motion.div>)}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-orange-500/30 bg-black flex-shrink-0">
          <Button type="button" variant="outline" onClick={handlePrevStep} disabled={formStep === 1} className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
            <ArrowLeft className="w-4 h-4"/>
            Previous
          </Button>
          
          <div className="flex gap-3">
            {formStep < 5 ? (<Button type="button" onClick={handleNextStep} className={`flex items-center gap-2 font-medium ${isCurrentStepValid()
                ? "bg-orange-500 hover:bg-orange-600 text-black"
                : "bg-gray-600 hover:bg-gray-500 text-gray-300"}`}>
                Next
                <ArrowRight className="w-4 h-4"/>
              </Button>) : (<Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-medium">
                {isSubmitting ? (<>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Submitting...
                  </>) : (<>
                    <CheckCircle className="w-4 h-4"/>
                    {isEditing ? "Update Property" : "Submit Property"}
                  </>)}
              </Button>)}
          </div>
        </div>
      </motion.div>
    </div>);
}
