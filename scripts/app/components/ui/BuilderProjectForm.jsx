"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Upload, Sparkles, MapPin, Building2, CheckCircle, Camera, FileText, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
// Delhi areas for locality dropdown (same as property form)
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
const projectAmenities = [
    "Swimming Pool", "Gymnasium", "Clubhouse", "Children's Play Area", "Landscaped Gardens",
    "Security", "Power Backup", "Lift", "Parking", "Jogging Track", "Sports Facilities",
    "Community Hall", "Senior Citizen Area", "Meditation/Yoga Area", "Indoor Games",
    "Library", "Business Center", "Amphitheater", "Water Body", "Fire Safety",
    "CCTV Surveillance", "Intercom Facility", "Visitor Management", "Waste Management",
    "Rainwater Harvesting", "Solar Panels", "EV Charging", "Wi-Fi Connectivity"
];
const propertyTypesOptions = [
    "Apartments", "Villas", "Floors", "Plots", "Shops", "Offices", "Studios", "Penthouses"
];
const paymentPlanOptions = [
    "Construction Linked Plan (CLP)", "Flexi Payment Plan", "Subvention Scheme",
    "Down Payment Plan", "Possession Linked Plan", "Time Linked Plan"
];
const greenCertifications = [
    "IGBC Certified", "LEED Certified", "GRIHA Certified", "Rainwater Harvesting",
    "Solar Power", "Waste Management", "Energy Efficient", "Green Building"
];
async function generateAIProjectDescription(projectData) {
    var _a, _b, _c, _d;
    const API_URL = "https://api.together.xyz/v1/completions";
    const API_KEY = process.env.NEXT_PUBLIC_TOGETHER_API_KEY || "";
    if (!API_KEY) {
        throw new Error("Together API key is not set");
    }
    const propertyTypesText = ((_a = projectData.propertyTypesOffered) === null || _a === void 0 ? void 0 : _a.length) > 0
        ? `Property types: ${projectData.propertyTypesOffered.join(", ")}.`
        : "";
    const amenitiesText = ((_b = projectData.projectAmenities) === null || _b === void 0 ? void 0 : _b.length) > 0
        ? `Amenities: ${projectData.projectAmenities.join(", ")}.`
        : "";
    const locationText = projectData.city
        ? `located in ${projectData.locality || ""} ${projectData.locality ? "," : ""} ${projectData.city}`
        : "";
    const prompt = `Write a compelling real estate project description for the following development project:

  Project Name: ${projectData.projectName}
  Project Type: ${projectData.projectType}
  Developer: ${((_c = projectData.developerContact) === null || _c === void 0 ? void 0 : _c.name) || ""}
  ${propertyTypesText}
  Stage: ${projectData.projectStage}
  ${locationText ? `Location: ${locationText}` : ""}
  ${amenitiesText}
  Tagline: ${projectData.projectTagline}

  Write a professional and engaging description highlighting the project's features, location advantages, and benefits. Keep it under 200 words, focus on selling points, and make it appealing to potential buyers and investors. Do not include pricing details. Don't include any markdown or formatting tags, just provide the plain text description. Write the description directly without any preamble.

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
                max_tokens: 300,
                temperature: 0.7,
                top_p: 0.9,
                stop: ["</s>", "[/INST]"],
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to generate description");
        }
        const data = await response.json();
        let generatedText = ((_d = data.choices[0]) === null || _d === void 0 ? void 0 : _d.text) || "";
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
export default function BuilderProjectForm({ onClose, onSubmit }) {
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Project Overview
        projectName: "",
        projectType: "",
        propertyTypesOffered: [],
        projectStage: "",
        reraRegistrationNo: "",
        reraDocument: null,
        projectTagline: "",
        developerDescription: "",
        // Step 2: Location & Connectivity
        city: "Delhi",
        locality: "",
        projectAddress: "",
        landmark: "",
        coordinates: {
            latitude: "",
            longitude: "",
        },
        distances: {
            airport: "",
            metro: "",
            school: "",
            hospital: "",
            mall: "",
        },
        // Step 3: Configuration & Pricing
        unitTypes: [
            {
                type: "",
                sizeRange: { min: "", max: "", unit: "sqft" },
                priceRange: { min: "", max: "", perSqft: "" },
            }
        ],
        paymentPlans: [],
        bookingAmount: "",
        allInclusivePricing: false,
        possessionDate: "",
        constructionStatus: "",
        // Step 4: Amenities & Features
        projectAmenities: [],
        unitSpecifications: "",
        greenCertifications: [],
        projectUSPs: [],
        // Step 5: Media
        projectImages: [],
        floorPlans: [],
        siteLayout: null,
        locationMap: null,
        projectBrochure: null,
        videoWalkthrough: "",
        // Contact Information
        developerContact: {
            name: "",
            phone: "",
            email: "",
            affiliation: "",
        },
    });
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [floorPlanPreviewUrls, setFloorPlanPreviewUrls] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
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
    const handlePropertyTypesChange = (propertyType) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { propertyTypesOffered: prev.propertyTypesOffered.includes(propertyType)
                ? prev.propertyTypesOffered.filter(type => type !== propertyType)
                : [...prev.propertyTypesOffered, propertyType] })));
    };
    const handleAmenityChange = (amenity) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { projectAmenities: prev.projectAmenities.includes(amenity)
                ? prev.projectAmenities.filter(a => a !== amenity)
                : [...prev.projectAmenities, amenity] })));
    };
    const handlePaymentPlanChange = (plan) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { paymentPlans: prev.paymentPlans.includes(plan)
                ? prev.paymentPlans.filter(p => p !== plan)
                : [...prev.paymentPlans, plan] })));
    };
    const handleCertificationChange = (cert) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { greenCertifications: prev.greenCertifications.includes(cert)
                ? prev.greenCertifications.filter(c => c !== cert)
                : [...prev.greenCertifications, cert] })));
    };
    const handleImageUpload = async (e, type) => {
        const files = Array.from(e.target.files || []);
        if (type === 'project') {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { projectImages: [...prev.projectImages, ...files] })));
            const newPreviewUrls = await Promise.all(files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => { var _a; return resolve((_a = e.target) === null || _a === void 0 ? void 0 : _a.result); };
                    reader.readAsDataURL(file);
                });
            }));
            setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
        else if (type === 'floorPlan') {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { floorPlans: [...prev.floorPlans, ...files] })));
            const newPreviewUrls = await Promise.all(files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => { var _a; return resolve((_a = e.target) === null || _a === void 0 ? void 0 : _a.result); };
                    reader.readAsDataURL(file);
                });
            }));
            setFloorPlanPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };
    const removeImage = (index, type) => {
        if (type === 'project') {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { projectImages: prev.projectImages.filter((_, i) => i !== index) })));
            setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        }
        else if (type === 'floorPlan') {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { floorPlans: prev.floorPlans.filter((_, i) => i !== index) })));
            setFloorPlanPreviewUrls(prev => prev.filter((_, i) => i !== index));
        }
    };
    const addUnitType = () => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { unitTypes: [
                ...prev.unitTypes,
                {
                    type: "",
                    sizeRange: { min: "", max: "", unit: "sqft" },
                    priceRange: { min: "", max: "", perSqft: "" },
                }
            ] })));
    };
    const removeUnitType = (index) => {
        if (formData.unitTypes.length > 1) {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { unitTypes: prev.unitTypes.filter((_, i) => i !== index) })));
        }
    };
    const handleUnitTypeChange = (index, field, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { unitTypes: prev.unitTypes.map((unit, i) => {
                if (i === index) {
                    if (field.includes('.')) {
                        const [parent, child] = field.split('.');
                        return Object.assign(Object.assign({}, unit), { [parent]: Object.assign(Object.assign({}, unit[parent]), { [child]: value }) });
                    }
                    else {
                        return Object.assign(Object.assign({}, unit), { [field]: value });
                    }
                }
                return unit;
            }) })));
    };
    const addUSP = () => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { projectUSPs: [...prev.projectUSPs, ""] })));
    };
    const removeUSP = (index) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { projectUSPs: prev.projectUSPs.filter((_, i) => i !== index) })));
    };
    const handleUSPChange = (index, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { projectUSPs: prev.projectUSPs.map((usp, i) => i === index ? value : usp) })));
    };
    const fetchCoordinates = async () => {
        if (!formData.locality || !formData.city)
            return;
        setIsLoadingCoordinates(true);
        try {
            const query = `${formData.locality}, ${formData.city}, India`;
            const response = await axios.get(`/api/geocode?q=${encodeURIComponent(query)}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setFormData(prev => (Object.assign(Object.assign({}, prev), { coordinates: {
                        latitude: String(lat),
                        longitude: String(lon),
                    } })));
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
            const description = await generateAIProjectDescription(formData);
            if (description) {
                setFormData(prev => (Object.assign(Object.assign({}, prev), { developerDescription: description })));
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
            const formData = new FormData();
            formData.append("file", image);
            formData.append("fileName", `project-${Date.now()}-${image.name}`);
            formData.append("folder", "/projects");
            try {
                const response = await axios.post("/api/upload", formData, {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Upload images
            const projectImageUrls = formData.projectImages.length > 0
                ? await uploadImages(formData.projectImages)
                : [];
            const floorPlanUrls = formData.floorPlans.length > 0
                ? await uploadImages(formData.floorPlans)
                : [];
            // Prepare submission data
            const validUnitTypes = formData.unitTypes
                .filter(unit => unit.type && unit.type.trim() !== "")
                .map(unit => ({
                type: unit.type.trim(),
                sizeRange: {
                    min: parseFloat(unit.sizeRange.min) || 0,
                    max: parseFloat(unit.sizeRange.max) || 0,
                    unit: unit.sizeRange.unit || "sqft",
                },
                priceRange: Object.assign({ min: parseFloat(unit.priceRange.min) || 0, max: parseFloat(unit.priceRange.max) || 0 }, (unit.priceRange.perSqft && unit.priceRange.perSqft !== "" && {
                    perSqft: parseFloat(unit.priceRange.perSqft)
                })),
            }));
            const submissionData = {
                projectName: formData.projectName,
                projectType: formData.projectType,
                propertyTypesOffered: formData.propertyTypesOffered,
                projectStage: formData.projectStage,
                reraRegistrationNo: formData.reraRegistrationNo,
                projectTagline: formData.projectTagline,
                developerDescription: formData.developerDescription,
                city: formData.city,
                locality: formData.locality,
                projectAddress: formData.projectAddress,
                landmark: formData.landmark,
                coordinates: {
                    latitude: parseFloat(formData.coordinates.latitude) || 0,
                    longitude: parseFloat(formData.coordinates.longitude) || 0,
                },
                distances: {
                    airport: formData.distances.airport ? parseFloat(formData.distances.airport) : undefined,
                    metro: formData.distances.metro ? parseFloat(formData.distances.metro) : undefined,
                    school: formData.distances.school ? parseFloat(formData.distances.school) : undefined,
                    hospital: formData.distances.hospital ? parseFloat(formData.distances.hospital) : undefined,
                    mall: formData.distances.mall ? parseFloat(formData.distances.mall) : undefined,
                },
                unitTypes: validUnitTypes,
                paymentPlans: formData.paymentPlans,
                bookingAmount: formData.bookingAmount ? parseFloat(formData.bookingAmount) : undefined,
                allInclusivePricing: formData.allInclusivePricing,
                possessionDate: formData.possessionDate ? new Date(formData.possessionDate).toISOString() : null,
                constructionStatus: formData.constructionStatus,
                projectAmenities: formData.projectAmenities,
                unitSpecifications: formData.unitSpecifications,
                greenCertifications: formData.greenCertifications,
                projectUSPs: formData.projectUSPs,
                projectImages: projectImageUrls,
                floorPlans: floorPlanUrls,
                videoWalkthrough: formData.videoWalkthrough,
                developerContact: {
                    name: formData.developerContact.name,
                    phone: formData.developerContact.phone,
                    email: formData.developerContact.email,
                    affiliation: formData.developerContact.affiliation,
                },
            };
            console.log("Submitting project data:", submissionData);
            console.log("unitTypes structure:", JSON.stringify(submissionData.unitTypes, null, 2));
            console.log("unitTypes type:", typeof submissionData.unitTypes);
            console.log("unitTypes is array:", Array.isArray(submissionData.unitTypes));
            await onSubmit(submissionData);
            toast.success("Project submitted successfully!");
            onClose();
        }
        catch (error) {
            console.error("Error submitting project:", error);
            toast.error("Failed to submit project. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Validation function for each step
    const validateStep = (step) => {
        const errors = [];
        switch (step) {
            case 1: // Project Overview
                if (!formData.projectName.trim())
                    errors.push("Project name is required");
                if (!formData.projectType.trim())
                    errors.push("Project type is required");
                if (formData.propertyTypesOffered.length === 0)
                    errors.push("At least one property type is required");
                if (!formData.projectStage.trim())
                    errors.push("Project stage is required");
                if (!formData.reraRegistrationNo.trim())
                    errors.push("RERA registration number is required");
                if (!formData.projectTagline.trim())
                    errors.push("Project tagline is required");
                if (!formData.developerDescription.trim())
                    errors.push("Developer description is required");
                break;
            case 2: // Location & Connectivity
                if (!formData.city.trim())
                    errors.push("City is required");
                if (!formData.locality.trim())
                    errors.push("Locality is required");
                if (!formData.projectAddress.trim())
                    errors.push("Project address is required");
                if (!formData.coordinates.latitude || !formData.coordinates.longitude) {
                    errors.push("Coordinates are required - please fetch coordinates");
                }
                break;
            case 3: // Configuration & Pricing
                if (formData.unitTypes.length === 0 || !formData.unitTypes[0].type.trim()) {
                    errors.push("At least one unit type is required");
                }
                // Validate each unit type
                formData.unitTypes.forEach((unit, index) => {
                    if (!unit.type.trim())
                        errors.push(`Unit type ${index + 1} name is required`);
                    if (!unit.sizeRange.min || !unit.sizeRange.max) {
                        errors.push(`Unit type ${index + 1} size range is required`);
                    }
                    if (!unit.priceRange.min || !unit.priceRange.max) {
                        errors.push(`Unit type ${index + 1} price range is required`);
                    }
                });
                if (!formData.possessionDate)
                    errors.push("Possession date is required");
                if (!formData.constructionStatus.trim())
                    errors.push("Construction status is required");
                break;
            case 4: // Amenities & Features - Optional step, no required fields
                break;
            case 5: // Media Uploads
                if (formData.projectImages.length === 0) {
                    errors.push("At least one project image is required");
                }
                break;
            case 6: // Contact Information
                if (!formData.developerContact.name.trim())
                    errors.push("Contact name is required");
                if (!formData.developerContact.phone.trim())
                    errors.push("Contact phone is required");
                if (!formData.developerContact.email.trim())
                    errors.push("Contact email is required");
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
        if (formStep < 6) {
            setFormStep(formStep + 1);
        }
    };
    const handlePrevStep = () => {
        if (formStep > 1) {
            setFormStep(formStep - 1);
        }
    };
    // Auto-fetch coordinates when locality changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.locality && formData.city) {
                fetchCoordinates();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData.locality, formData.city]);
    return (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 border border-orange-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-500/30 bg-gradient-to-r from-gray-900 to-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-orange-500"/>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Post Builder Project
              </h2>
              <p className="text-gray-300">Step {formStep} of 6</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-500/20 rounded-full transition-colors text-gray-300 hover:text-white">
            <X className="w-6 h-6"/>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-orange-500/30 bg-gray-900 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (<div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step <= formStep
                ? "bg-orange-500 text-black"
                : "bg-gray-700 text-gray-400"}`}>
                  {step}
                </div>
                {step < 6 && (<div className={`w-16 h-1 mx-2 ${step < formStep ? "bg-orange-500" : "bg-gray-700"}`}/>)}
              </div>))}
          </div>
          <div className="text-sm text-gray-300">
            {formStep === 1 && "Project Overview"}
            {formStep === 2 && "Location & Connectivity"}
            {formStep === 3 && "Configuration & Pricing"}
            {formStep === 4 && "Amenities & Features"}
            {formStep === 5 && "Media Uploads"}
            {formStep === 6 && "Contact Information"}
          </div>
          
          {/* Validation Status */}
          {!isCurrentStepValid() && (<div className="text-xs text-red-400 mt-1">
              ⚠️ Please fill all required fields to proceed
            </div>)}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-black text-white min-h-0">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Project Overview */}
              {formStep === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="As per RERA" required/>
                    </div>
                    
                    <div>
                      <Label htmlFor="projectType">Project Type *</Label>
                      <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { projectType: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="mixed-use">Mixed Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Property Types Offered *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {propertyTypesOptions.map((type) => (<div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type} checked={formData.propertyTypesOffered.includes(type)} onCheckedChange={() => handlePropertyTypesChange(type)}/>
                          <Label htmlFor={type} className="text-sm">{type}</Label>
                        </div>))}
                    </div>
                  </div>

                  <div>
                    <Label>Project Stage *</Label>
                    <RadioGroup value={formData.projectStage} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { projectStage: value })))} className="flex space-x-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="under-construction" id="under-construction"/>
                        <Label htmlFor="under-construction">Under Construction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ready-to-move" id="ready-to-move"/>
                        <Label htmlFor="ready-to-move">Ready to Move</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="reraRegistrationNo">RERA Registration No. *</Label>
                    <Input id="reraRegistrationNo" name="reraRegistrationNo" value={formData.reraRegistrationNo} onChange={handleInputChange} placeholder="Enter RERA registration number" required/>
                  </div>

                  <div>
                    <Label htmlFor="projectTagline">Project Tagline/Headline *</Label>
                    <Input id="projectTagline" name="projectTagline" value={formData.projectTagline} onChange={handleInputChange} placeholder="Max 80 characters" maxLength={80} required/>
                    <p className="text-sm text-gray-300 mt-1">
                      {formData.projectTagline.length}/80 characters
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="developerDescription">Developer Description *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateAIDescription} disabled={isGeneratingDescription} className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                        <Sparkles className="w-4 h-4"/>
                        {isGeneratingDescription ? "Generating..." : "AI Generate"}
                      </Button>
                    </div>
                    <Textarea id="developerDescription" name="developerDescription" value={formData.developerDescription} onChange={handleInputChange} placeholder="Short description about the company" rows={4} required/>
                  </div>
                </motion.div>)}

              {/* Step 2: Location & Connectivity */}
              {formStep === 2 && (<motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select value={formData.city} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { city: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="locality">Locality/Sector *</Label>
                      <Select value={formData.locality} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { locality: value })))}>
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
                    <Label htmlFor="projectAddress">Project Address *</Label>
                    <Textarea id="projectAddress" name="projectAddress" value={formData.projectAddress} onChange={handleInputChange} placeholder="Full postal address" rows={3} required/>
                  </div>

                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input id="landmark" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Nearby known place"/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="coordinates.latitude">Latitude</Label>
                      <div className="flex gap-2">
                        <Input id="coordinates.latitude" name="coordinates.latitude" value={formData.coordinates.latitude} onChange={handleInputChange} placeholder="Auto-generated" readOnly/>
                        <Button type="button" variant="outline" onClick={fetchCoordinates} disabled={isLoadingCoordinates} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                          <MapPin className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="coordinates.longitude">Longitude</Label>
                      <Input id="coordinates.longitude" name="coordinates.longitude" value={formData.coordinates.longitude} onChange={handleInputChange} placeholder="Auto-generated" readOnly/>
                    </div>
                  </div>

                  <div>
                    <Label>Distance from (in km) - Optional</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                      <div>
                        <Label htmlFor="distances.airport" className="text-sm">Airport</Label>
                        <Input id="distances.airport" name="distances.airport" value={formData.distances.airport} onChange={handleInputChange} placeholder="km" type="number"/>
                      </div>
                      <div>
                        <Label htmlFor="distances.metro" className="text-sm">Metro</Label>
                        <Input id="distances.metro" name="distances.metro" value={formData.distances.metro} onChange={handleInputChange} placeholder="km" type="number"/>
                      </div>
                      <div>
                        <Label htmlFor="distances.school" className="text-sm">School</Label>
                        <Input id="distances.school" name="distances.school" value={formData.distances.school} onChange={handleInputChange} placeholder="km" type="number"/>
                      </div>
                      <div>
                        <Label htmlFor="distances.hospital" className="text-sm">Hospital</Label>
                        <Input id="distances.hospital" name="distances.hospital" value={formData.distances.hospital} onChange={handleInputChange} placeholder="km" type="number"/>
                      </div>
                      <div>
                        <Label htmlFor="distances.mall" className="text-sm">Mall</Label>
                        <Input id="distances.mall" name="distances.mall" value={formData.distances.mall} onChange={handleInputChange} placeholder="km" type="number"/>
                      </div>
                    </div>
                  </div>
                </motion.div>)}

              {/* Step 3: Configuration & Pricing */}
              {formStep === 3 && (<motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Unit Types *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addUnitType} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                        Add Unit Type
                      </Button>
                    </div>
                    
                    {formData.unitTypes.map((unit, index) => (<div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Unit Type {index + 1}</h4>
                          {formData.unitTypes.length > 1 && (<Button type="button" variant="ghost" size="sm" onClick={() => removeUnitType(index)}>
                              <X className="w-4 h-4"/>
                            </Button>)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Type (e.g., 1BHK, 2BHK)</Label>
                            <Input value={unit.type} onChange={(e) => handleUnitTypeChange(index, 'type', e.target.value)} placeholder="1BHK"/>
                          </div>
                          
                          <div>
                            <Label>Size Range (Min - Max)</Label>
                            <div className="flex gap-2">
                              <Input value={unit.sizeRange.min} onChange={(e) => handleUnitTypeChange(index, 'sizeRange.min', e.target.value)} placeholder="Min" type="number"/>
                              <Input value={unit.sizeRange.max} onChange={(e) => handleUnitTypeChange(index, 'sizeRange.max', e.target.value)} placeholder="Max" type="number"/>
                              <Select value={unit.sizeRange.unit} onValueChange={(value) => handleUnitTypeChange(index, 'sizeRange.unit', value)}>
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sqft">sqft</SelectItem>
                                  <SelectItem value="sqm">sqm</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Price Range (Lakhs)</Label>
                            <div className="flex gap-2">
                              <Input value={unit.priceRange.min} onChange={(e) => handleUnitTypeChange(index, 'priceRange.min', e.target.value)} placeholder="Min" type="number"/>
                              <Input value={unit.priceRange.max} onChange={(e) => handleUnitTypeChange(index, 'priceRange.max', e.target.value)} placeholder="Max" type="number"/>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Per Sq.ft Price (Optional)</Label>
                          <Input value={unit.priceRange.perSqft} onChange={(e) => handleUnitTypeChange(index, 'priceRange.perSqft', e.target.value)} placeholder="Per sq.ft price" type="number"/>
                        </div>
                      </div>))}
                  </div>

                  <div>
                    <Label>Payment Plans</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {paymentPlanOptions.map((plan) => (<div key={plan} className="flex items-center space-x-2">
                          <Checkbox id={plan} checked={formData.paymentPlans.includes(plan)} onCheckedChange={() => handlePaymentPlanChange(plan)}/>
                          <Label htmlFor={plan} className="text-sm">{plan}</Label>
                        </div>))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bookingAmount">Booking Amount (Lakhs)</Label>
                      <Input id="bookingAmount" name="bookingAmount" value={formData.bookingAmount} onChange={handleInputChange} placeholder="Optional" type="number"/>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox id="allInclusivePricing" checked={formData.allInclusivePricing} onCheckedChange={(checked) => setFormData(prev => (Object.assign(Object.assign({}, prev), { allInclusivePricing: checked })))}/>
                      <Label htmlFor="allInclusivePricing">All-Inclusive Pricing (GST, PLC, Reg. Charges)</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="possessionDate">Possession Date *</Label>
                      <Input id="possessionDate" name="possessionDate" value={formData.possessionDate} onChange={handleInputChange} type="date" required/>
                    </div>
                    
                    <div>
                      <Label htmlFor="constructionStatus">Construction Status *</Label>
                      <Select value={formData.constructionStatus} onValueChange={(value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { constructionStatus: value })))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="site-excavation">Site Excavation</SelectItem>
                          <SelectItem value="foundation">Foundation</SelectItem>
                          <SelectItem value="structure">Structure</SelectItem>
                          <SelectItem value="interior">Interior</SelectItem>
                          <SelectItem value="finishing">Finishing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>)}

              {/* Step 4: Amenities & Features */}
              {formStep === 4 && (<motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <Label>Project Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {projectAmenities.map((amenity) => (<div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={amenity} checked={formData.projectAmenities.includes(amenity)} onCheckedChange={() => handleAmenityChange(amenity)}/>
                          <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                        </div>))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="unitSpecifications">Unit Specifications</Label>
                    <Textarea id="unitSpecifications" name="unitSpecifications" value={formData.unitSpecifications} onChange={handleInputChange} placeholder="Flooring, Bathroom fittings, Doors, etc." rows={4}/>
                  </div>

                  <div>
                    <Label>Green/Smart Certifications</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {greenCertifications.map((cert) => (<div key={cert} className="flex items-center space-x-2">
                          <Checkbox id={cert} checked={formData.greenCertifications.includes(cert)} onCheckedChange={() => handleCertificationChange(cert)}/>
                          <Label htmlFor={cert} className="text-sm">{cert}</Label>
                        </div>))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Project USPs (Up to 5 highlights)</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addUSP} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                        Add USP
                      </Button>
                    </div>
                    
                    {formData.projectUSPs.map((usp, index) => (<div key={index} className="flex gap-2 mb-2">
                        <Input value={usp} onChange={(e) => handleUSPChange(index, e.target.value)} placeholder={`USP ${index + 1}`}/>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeUSP(index)}>
                          <X className="w-4 h-4"/>
                        </Button>
                      </div>))}
                    
                    {formData.projectUSPs.length === 0 && (<p className="text-sm text-gray-300">No USPs added yet. Click &quot;Add USP&quot; to start.</p>)}
                  </div>
                </motion.div>)}

              {/* Step 5: Media Uploads */}
              {formStep === 5 && (<motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <Label className="text-white">Project Images * (Elevation, Sample Flat, Amenities)</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-orange-500/30 rounded-lg p-6 text-center hover:border-orange-500/50 transition-colors">
                        <Camera className="w-12 h-12 text-orange-500 mx-auto mb-4"/>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">
                            Drag and drop images here or click to browse
                          </p>
                          <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} className="hidden" id="project-images"/>
                          <Button type="button" variant="outline" onClick={() => { var _a; return (_a = document.getElementById('project-images')) === null || _a === void 0 ? void 0 : _a.click(); }} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                            <Upload className="w-4 h-4 mr-2"/>
                            Choose Images
                          </Button>
                        </div>
                      </div>
                      
                      {imagePreviewUrls.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {imagePreviewUrls.map((url, index) => (<div key={index} className="relative">
                              <Image src={url} alt={`Project ${index + 1}`} width={200} height={150} className="w-full h-32 object-cover rounded-lg"/>
                              <button type="button" onClick={() => removeImage(index, 'project')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                <X className="w-4 h-4"/>
                              </button>
                            </div>))}
                        </div>)}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Floor Plans (Flat-wise PDFs or JPEG)</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-orange-500/30 rounded-lg p-6 text-center hover:border-orange-500/50 transition-colors">
                        <FileText className="w-12 h-12 text-orange-500 mx-auto mb-4"/>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">
                            Upload floor plan images or PDFs
                          </p>
                          <input type="file" multiple accept="image/*,.pdf" onChange={(e) => handleImageUpload(e, 'floorPlan')} className="hidden" id="floor-plans"/>
                          <Button type="button" variant="outline" onClick={() => { var _a; return (_a = document.getElementById('floor-plans')) === null || _a === void 0 ? void 0 : _a.click(); }} className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black">
                            <Upload className="w-4 h-4 mr-2"/>
                            Choose Floor Plans
                          </Button>
                        </div>
                      </div>
                      
                      {floorPlanPreviewUrls.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {floorPlanPreviewUrls.map((url, index) => (<div key={index} className="relative">
                              <Image src={url} alt={`Floor Plan ${index + 1}`} width={200} height={150} className="w-full h-32 object-cover rounded-lg"/>
                              <button type="button" onClick={() => removeImage(index, 'floorPlan')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                <X className="w-4 h-4"/>
                              </button>
                            </div>))}
                        </div>)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="videoWalkthrough">Video/YouTube Walkthrough (Optional)</Label>
                    <Input id="videoWalkthrough" name="videoWalkthrough" value={formData.videoWalkthrough} onChange={handleInputChange} placeholder="YouTube or video URL"/>
                  </div>
                </motion.div>)}

              {/* Step 6: Contact Information */}
              {formStep === 6 && (<motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="developerContact.name">Name *</Label>
                      <Input id="developerContact.name" name="developerContact.name" value={formData.developerContact.name} onChange={handleInputChange} placeholder="Your full name" required/>
                    </div>
                    
                    <div>
                      <Label htmlFor="developerContact.phone">Phone Number *</Label>
                      <Input id="developerContact.phone" name="developerContact.phone" value={formData.developerContact.phone} onChange={handleInputChange} placeholder="+91 9876543210" required/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="developerContact.email">Email *</Label>
                      <Input id="developerContact.email" name="developerContact.email" value={formData.developerContact.email} onChange={handleInputChange} placeholder="your.email@example.com" type="email" required/>
                    </div>
                    
                    <div>
                      <Label htmlFor="developerContact.affiliation">Company/Affiliation</Label>
                      <Input id="developerContact.affiliation" name="developerContact.affiliation" value={formData.developerContact.affiliation} onChange={handleInputChange} placeholder="Company name (optional)"/>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-500 mb-2">Review Your Project</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong className="text-white">Project:</strong> {formData.projectName}</p>
                      <p><strong className="text-white">Type:</strong> {formData.projectType}</p>
                      <p><strong className="text-white">Location:</strong> {formData.locality}, {formData.city}</p>
                      <p><strong className="text-white">Stage:</strong> {formData.projectStage}</p>
                      <p><strong className="text-white">Images:</strong> {formData.projectImages.length} uploaded</p>
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
            {formStep < 6 ? (<Button type="button" onClick={handleNextStep} className={`flex items-center gap-2 font-medium ${isCurrentStepValid()
                ? "bg-orange-500 hover:bg-orange-600 text-black"
                : "bg-gray-600 hover:bg-gray-500 text-gray-300"}`}>
                Next
                <ArrowRight className="w-4 h-4"/>
              </Button>) : (<Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-medium">
                {isSubmitting ? (<>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>
                    Submitting...
                  </>) : (<>
                    <CheckCircle className="w-4 h-4"/>
                    Submit Project
                  </>)}
              </Button>)}
          </div>
        </div>
      </motion.div>
    </div>);
}
