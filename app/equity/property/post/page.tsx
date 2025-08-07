"use client";
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  ImageIcon,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Shield,
  Settings,
  Star,
  User,
} from "lucide-react";

// Interface for commercial property form data
interface CommercialPropertyFormData {
  // Step 1: Property Type & Category
  propertyType: string;
  listingCategory: string;

  // Step 2: Basic Property Details
  projectName: string;
  fullAddress: string;
  pinCode: string;
  city: string;
  locality: string;
  googleMapsPin: string;
  possessionStatus: string;
  builtUpArea: string;
  totalValuation: string;
  minimumInvestmentTicket: string;
  customTicketAmount: string;

  // Step 3: Fractional Investment Parameters
  targetRaiseAmount: string;
  ownershipSplit: string;
  totalShares: string;
  sharePercentage: string;
  rentalYield: string;
  annualROIProjection: string;
  minimumHoldingPeriod: string;
  exitOptions: string[];

  // Step 4: Document Uploads (simplified for demo)
  documentsUploaded: boolean;

  // Step 5: Media & Marketing
  images: File[];
  existingImages: string[];
  virtualTourLink: string;
  requestVirtualTour: boolean;

  // Step 6: Additional Highlights
  highlights: string[];
  customHighlights: string;
  tenantName: string;

  // Step 7: Contact Information & Legal
  ownerDetails: {
    name: string;
    phone: string;
    email: string;
    companyName: string;
  };
  termsAccepted: boolean;

  // Internal coordinates
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

// Lazy load heavy components
const EquityNavigation = lazy(
  () => import("@/app/equity/components/EquityNavigation")
);
const AuthModal = lazy(() =>
  import("@/app/equity/components").then((mod) => ({ default: mod.AuthModal }))
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function CommercialPropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRestoringData, setIsRestoringData] = useState(false);

  // Property types for commercial real estate
  const propertyTypes = useMemo(
    () => [
      {
        value: "commercial-office",
        label: "Commercial Office",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        value: "retail-shop",
        label: "Retail Shop",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        value: "co-working-space",
        label: "Co-working Space",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        value: "warehousing-industrial",
        label: "Warehousing / Industrial",
        icon: <Building2 className="w-5 h-5" />,
      },
    ],
    []
  );

  // Investment ticket options
  const investmentTicketOptions = useMemo(
    () => ["₹10,000", "₹25,000", "₹50,000", "Custom Amount"],
    []
  );

  // Possession status options
  const possessionStatusOptions = useMemo(
    () => ["Ready to Move", "Under Construction", "Leased Asset"],
    []
  );

  // Exit options
  const exitOptions = useMemo(
    () => [
      "Platform Resale",
      "Owner Buyback",
      "Secondary Marketplace (coming soon)",
    ],
    []
  );

  // Property highlights/USP options
  const highlightOptions = useMemo(
    () => [
      "Grade-A construction",
      "Tenanted property",
      "Proximity to metro/highway",
      "Expected price appreciation",
      "Developer track record",
      "Green building / IGBC certification",
      "Pre-leased income",
    ],
    []
  );

  // Delhi areas with coordinates mapping
  const delhiAreas = useMemo(
    () =>
      [
        "AAYA NAGAR",
        "ADARSH NAGAR",
        "ALIPUR",
        "AMBEDKAR NAGAR",
        "ANAND PARBAT",
        "ANANDVIHAR",
        "ANDREWS GANJ",
        "AZADPUR",
        "BADARPUR",
        "BARAKHAMBA ROAD",
        "BAWANA",
        "BHALSWA JAHANGIR PUR",
        "BIJWASAN",
        "BINDAPUR",
        "BRAHMPURI",
        "BURARI",
        "CHANAKYAPURI",
        "CHANDNI MAHAL",
        "CHHAWLA",
        "CHITTARANJAN PARK",
        "CONNAUGHT PLACE",
        "D.B.G ROAD",
        "DABRI",
        "DARYA GANJ",
        "DEFENCE COLONY",
        "DELHI CANTT",
        "DWARKA",
        "FARASH BAZAR",
        "FRIENDS COLONY",
        "GANDHI NAGAR",
        "GEETA COLONY",
        "GHAZIPUR",
        "GOVINDPURI",
        "GREATER KAILASH",
        "H. N. DIN",
        "HARI NAGAR",
        "HASTSAL",
        "HAUZ KHAS",
        "HAUZQAZI",
        "I.P. ESTATE",
        "INDERPURI",
        "JAFFARPUR KALAN",
        "JAGATPURI",
        "JAHANGIR PURI",
        "JAMA MASJID",
        "JANAKPURI",
        "JANGPURA",
        "KAKROLA",
        "KALKAJI",
        "KALYANPURI",
        "KAMLA MARKET",
        "KANJHAWLA",
        "KAPASHERA",
        "KARKARDOOMA",
        "KAROL BAGH",
        "KASHMERE GATE",
        "KESHAV PURAM",
        "KHYALA",
        "KIRTI NAGAR",
        "KOTLA MUBARAKPUR",
        "KOTWALI",
        "LAHORI GATE",
        "LAJPAT NAGAR",
        "LAWRENCE ROAD",
        "LAXMI NAGAR",
        "LODHI ROAD",
        "MALVIYA NAGAR",
        "MANDIR MARG",
        "MATIALA",
        "MAURYA ENCLAVE",
        "MAYAPURI",
        "MAYUR VIHAR",
        "MEHRAULI",
        "MODEL TOWN",
        "MOHAN GARDEN",
        "MUNDKA",
        "NABI KARIM",
        "NAJAFGARH",
        "NAND NAGRI",
        "NANGLOI",
        "NARAINA",
        "NARELA",
        "NEHRU PLACE",
        "NETAJI SUBHASH PLACE",
        "NEW FRIENDS COLONY",
        "NIHAL VIHAR",
        "OKHLA",
        "PAHARGANJ",
        "PALAM",
        "PANDAV NAGAR",
        "PARLIAMENT STREET",
        "PARSHAD NAGAR",
        "PASCHIM VIHAR",
        "PATEL NAGAR",
        "PATPARGANJ",
        "PEERAGARHI",
        "POCHANPUR",
        "PRASHANT VIHAR",
        "PREET VIHAR",
        "PULPAHLADPUR",
        "PUNJABI BAGH",
        "R. K. PURAM",
        "RAJINDER NAGAR",
        "RAJOURI GARDEN",
        "RANHAULA",
        "RANJIT NAGAR",
        "ROHINI",
        "SABZI MANDI",
        "SADAR BAZAR",
        "SADH NAGAR",
        "SAGARPUR",
        "SAKET",
        "SARAI ROHILLA",
        "SARITA VIHAR",
        "SAROJINI NAGAR",
        "SEELAMPUR",
        "SHAHDARA",
        "SHAKURPUR",
        "SHASTRI PARK",
        "SHEIKH SARAI",
        "SOUTH EXTENSION",
        "SUBHASH NAGAR",
        "SUBZIMANDI",
        "SUNDAR NAGRI",
        "TAGORE GARDEN",
        "TIGRI",
        "TILAK MARG",
        "TILAK NAGAR",
        "TRI NAGAR",
        "TRILOKPURI",
        "TUGLAK ROAD",
        "TUGLAKABAD",
        "UTTAM NAGAR",
        "VASANT KUNJ",
        "VASANT VIHAR",
        "VASUNDHARA ENCLAVE",
        "VIKAS PURI",
        "VIKASPURI",
        "VIVEK VIHAR",
        "WAZIRPUR",
        "YAMUNA VIHAR",
      ].sort(),
    []
  );

  // Coordinates mapping for Delhi areas (sample data - in production this would come from a more comprehensive database)
  const areaCoordinates = useMemo(
    () =>
      ({
        "CONNAUGHT PLACE": { latitude: "28.6304", longitude: "77.2177" },
        "KAROL BAGH": { latitude: "28.6519", longitude: "77.1937" },
        DWARKA: { latitude: "28.5921", longitude: "77.0460" },
        ROHINI: { latitude: "28.7041", longitude: "77.1025" },
        "LAJPAT NAGAR": { latitude: "28.5653", longitude: "77.2430" },
        "NEHRU PLACE": { latitude: "28.5494", longitude: "77.2551" },
        "GREATER KAILASH": { latitude: "28.5244", longitude: "77.2426" },
        SAKET: { latitude: "28.5245", longitude: "77.2066" },
        "VASANT VIHAR": { latitude: "28.5672", longitude: "77.1594" },
        "DEFENSE COLONY": { latitude: "28.5729", longitude: "77.2294" },
        JANAKPURI: { latitude: "28.6219", longitude: "77.0856" },
        "RAJOURI GARDEN": { latitude: "28.6498", longitude: "77.1206" },
        "UTTAM NAGAR": { latitude: "28.6197", longitude: "77.0594" },
        SHAHDARA: { latitude: "28.6692", longitude: "77.2856" },
        "MAYUR VIHAR": { latitude: "28.6097", longitude: "77.2956" },
        "PREET VIHAR": { latitude: "28.6367", longitude: "77.2947" },
        "VASANT KUNJ": { latitude: "28.5244", longitude: "77.1594" },
        "HAUZ KHAS": { latitude: "28.5494", longitude: "77.2006" },
        "SOUTH EXTENSION": { latitude: "28.5729", longitude: "77.2178" },
        CHANAKYAPURI: { latitude: "28.5984", longitude: "77.1847" },
        // Add more coordinates as needed
      } as Record<string, { latitude: string; longitude: string }>),
    []
  );

  const [formData, setFormData] = useState<CommercialPropertyFormData>({
    // Step 1: Property Type & Category
    propertyType: "",
    listingCategory: "Fractional Ownership",

    // Step 2: Basic Property Details
    projectName: "",
    fullAddress: "",
    pinCode: "",
    city: "Delhi",
    locality: "",
    googleMapsPin: "",
    possessionStatus: "",
    builtUpArea: "",
    totalValuation: "",
    minimumInvestmentTicket: "",
    customTicketAmount: "",

    // Step 3: Fractional Investment Parameters
    targetRaiseAmount: "",
    ownershipSplit: "",
    totalShares: "",
    sharePercentage: "",
    rentalYield: "",
    annualROIProjection: "",
    minimumHoldingPeriod: "",
    exitOptions: [],

    // Step 4: Document Uploads
    documentsUploaded: false,

    // Step 5: Media & Marketing
    images: [],
    existingImages: [],
    virtualTourLink: "",
    requestVirtualTour: false,

    // Step 6: Additional Highlights
    highlights: [],
    customHighlights: "",
    tenantName: "",

    // Step 7: Contact Information & Legal
    ownerDetails: {
      name: "",
      phone: "",
      email: "",
      companyName: "",
    },
    termsAccepted: false,

    // Internal coordinates
    coordinates: {
      latitude: "",
      longitude: "",
    },
  });

  // State for file uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // State for Step 5 media uploads
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedBrochure, setUploadedBrochure] = useState<File | null>(null);
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [isBrochureDragging, setIsBrochureDragging] = useState(false);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("commercialPropertyFormData");
    const savedFormStep = localStorage.getItem("commercialPropertyFormStep");

    if (savedFormData || savedFormStep) {
      setIsRestoringData(true);
    }

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }

    if (savedFormStep) {
      const step = parseInt(savedFormStep);
      if (step >= 1 && step <= 7) {
        setFormStep(step);
      }
    }

    // Hide the restoration indicator after a short delay
    setTimeout(() => {
      setIsRestoringData(false);
    }, 1500);
  }, []);

  // Save form data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(
      "commercialPropertyFormData",
      JSON.stringify(formData)
    );
  }, [formData]);

  // Save form step to localStorage whenever formStep changes
  useEffect(() => {
    localStorage.setItem("commercialPropertyFormStep", formStep.toString());
  }, [formStep]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("authToken") ||
          localStorage.getItem("authToken")
        : null;

    if (!token) {
      setShowAuthModal(true);
      setLoading(false);
      return;
    }

    setShowAuthModal(false);
    setLoading(false);
  }, [router]);

  // Input change handler
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;

      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as any),
            [child]:
              type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        }));
      }
    },
    []
  );

  // Handle highlight changes
  const handleHighlightChange = useCallback((highlight: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.includes(highlight)
        ? prev.highlights.filter((h: string) => h !== highlight)
        : [...prev.highlights, highlight],
    }));
  }, []);

  // Handle exit option changes
  const handleExitOptionChange = useCallback((option: string) => {
    setFormData((prev) => ({
      ...prev,
      exitOptions: prev.exitOptions.includes(option)
        ? prev.exitOptions.filter((o: string) => o !== option)
        : [...prev.exitOptions, option],
    }));
  }, []);

  // Handle locality change with automatic coordinate population
  const handleLocalityChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        locality: value,
        coordinates: areaCoordinates[value] || { latitude: "", longitude: "" },
      }));
    },
    [areaCoordinates]
  );

  // File upload handlers
  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValidType =
        file.type === "application/pdf" || file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);

    // Auto-check the documents uploaded checkbox if files are uploaded
    if (validFiles.length > 0) {
      setFormData((prev) => ({ ...prev, documentsUploaded: true }));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // If no files left, uncheck the documents uploaded checkbox
      if (newFiles.length === 0) {
        setFormData((prev) => ({ ...prev, documentsUploaded: false }));
      }
      return newFiles;
    });
  }, []);

  // Step 5 file upload handlers
  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    setUploadedImages((prev) => [...prev, ...validFiles]);
  }, []);

  const handleBrochureUpload = useCallback((file: File) => {
    if (file.type === "application/pdf" && file.size <= 10 * 1024 * 1024) {
      setUploadedBrochure(file);
    }
  }, []);

  const handleImageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragging(true);
  }, []);

  const handleImageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragging(false);
  }, []);

  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsImageDragging(false);
      if (e.dataTransfer.files) {
        handleImageUpload(e.dataTransfer.files);
      }
    },
    [handleImageUpload]
  );

  const handleBrochureDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsBrochureDragging(true);
  }, []);

  const handleBrochureDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsBrochureDragging(false);
  }, []);

  const handleBrochureDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsBrochureDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleBrochureUpload(e.dataTransfer.files[0]);
      }
    },
    [handleBrochureUpload]
  );

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeBrochure = useCallback(() => {
    setUploadedBrochure(null);
  }, []);

  // Form validation functions for each step
  const validateStep1 = useCallback(() => {
    return formData.propertyType !== "";
  }, [formData.propertyType]);

  const validateStep2 = useCallback(() => {
    const required = [
      formData.projectName,
      formData.fullAddress,
      formData.pinCode,
      formData.city,
      formData.locality,
      formData.possessionStatus,
      formData.builtUpArea,
      formData.totalValuation,
      formData.minimumInvestmentTicket,
    ];

    // If custom amount is selected, validate that too
    if (formData.minimumInvestmentTicket === "Custom Amount") {
      required.push(formData.customTicketAmount);
    }

    return required.every((field) => field && field.toString().trim() !== "");
  }, [formData]);

  const validateStep3 = useCallback(() => {
    const required = [
      formData.targetRaiseAmount,
      formData.ownershipSplit,
      formData.rentalYield,
      formData.annualROIProjection,
      formData.minimumHoldingPeriod,
    ];

    return (
      required.every((field) => field && field.toString().trim() !== "") &&
      formData.exitOptions.length > 0
    );
  }, [formData]);

  const validateStep4 = useCallback(() => {
    return formData.documentsUploaded && uploadedFiles.length > 0;
  }, [formData.documentsUploaded, uploadedFiles.length]);

  const validateStep5 = useCallback(() => {
    // Check if at least some images are uploaded (minimum 6 recommended but not strictly enforced for demo)
    return uploadedImages.length > 0; // Can adjust this to require minimum 6 images
  }, [uploadedImages.length]);

  const validateStep6 = useCallback(() => {
    // Highlights are optional, so always valid
    return true;
  }, []);

  const validateStep7 = useCallback(() => {
    const required = [
      formData.ownerDetails.name,
      formData.ownerDetails.phone,
      formData.ownerDetails.email,
    ];

    return (
      required.every((field) => field && field.trim() !== "") &&
      formData.termsAccepted
    );
  }, [formData]);

  // Get validation function for current step
  const getCurrentStepValidation = useCallback(() => {
    switch (formStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return validateStep5();
      case 6:
        return validateStep6();
      case 7:
        return validateStep7();
      default:
        return false;
    }
  }, [
    formStep,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
    validateStep6,
    validateStep7,
  ]);

  // Step navigation with validation
  const handleNextStep = useCallback(() => {
    const isValid = getCurrentStepValidation();

    if (!isValid) {
      setError(getValidationMessage(formStep));
      return;
    }

    if (formStep < 7) {
      setFormStep(formStep + 1);
      setError("");
    }
  }, [formStep, getCurrentStepValidation]);

  // Get validation message for each step
  const getValidationMessage = useCallback((step: number) => {
    switch (step) {
      case 1:
        return "Please select a property type to continue.";
      case 2:
        return "Please fill in all required basic property details.";
      case 3:
        return "Please complete all fractional investment parameters and select at least one exit option.";
      case 4:
        return "Please confirm that you have uploaded all required documents.";
      case 5:
        return "Please add property media.";
      case 6:
        return "Please review property highlights.";
      case 7:
        return "Please fill in all contact details and accept the terms and conditions.";
      default:
        return "Please complete all required fields.";
    }
  }, []);

  const handlePrevStep = useCallback(() => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
      setError("");
    }
  }, [formStep]);

  // Form submission
  const uploadFileToStorage = async (file: File): Promise<string> => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",

        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "File upload failed");
      }

      // FIX: return correct key from ImageKit response

      return result.url;
    } catch (error) {
      console.error("File upload error:", error);

      throw error;
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setError("");

      setSuccess("");

      setSubmitting(true);

      try {
        // Get auth token

        const token =
          sessionStorage.getItem("authToken") ||
          localStorage.getItem("authToken");

        if (!token) {
          setError("Please login to continue");

          setSubmitting(false);

          return;
        }

        // Upload files first

        setSuccess("Uploading files...");

        // Upload documents

        const uploadedDocumentUrls = await Promise.all(
          uploadedFiles.map(async (file) => {
            const fileUrl = await uploadFileToStorage(file);

            return {
              fileName: file.name,

              fileUrl,

              fileSize: file.size,

              fileType: file.type,
            };
          })
        );

        // Upload images

        const uploadedImageUrls = await Promise.all(
          uploadedImages.map(async (file) => {
            const fileUrl = await uploadFileToStorage(file);

            return {
              fileName: file.name,

              fileUrl,

              fileSize: file.size,
            };
          })
        );

        // Upload brochure if exists

        let brochureData = undefined;

        if (uploadedBrochure) {
          const brochureUrl = await uploadFileToStorage(uploadedBrochure);

          brochureData = {
            fileName: uploadedBrochure.name,

            fileUrl: brochureUrl,

            fileSize: uploadedBrochure.size,
          };
        }

        setSuccess("Files uploaded successfully. Submitting property...");

        // Prepare the data for API

        const apiData = {
          // Step 1: Property Type & Category

          propertyType: formData.propertyType,

          listingCategory: formData.listingCategory,

          // Step 2: Basic Property Details

          projectName: formData.projectName,

          fullAddress: formData.fullAddress,

          pinCode: formData.pinCode,

          city: formData.city,

          locality: formData.locality,

          googleMapsPin: formData.googleMapsPin || undefined,

          possessionStatus: formData.possessionStatus,

          builtUpArea: parseFloat(formData.builtUpArea),

          totalValuation: parseFloat(formData.totalValuation),

          minimumInvestmentTicket: formData.minimumInvestmentTicket,

          customTicketAmount: formData.customTicketAmount
            ? parseFloat(formData.customTicketAmount)
            : undefined,

          // Step 3: Fractional Investment Parameters

          targetRaiseAmount: parseFloat(formData.targetRaiseAmount),

          ownershipSplit: formData.ownershipSplit,

          totalShares: formData.totalShares
            ? parseFloat(formData.totalShares)
            : undefined,

          sharePercentage: formData.sharePercentage
            ? parseFloat(formData.sharePercentage)
            : undefined,

          rentalYield: parseFloat(formData.rentalYield),

          annualROIProjection: parseFloat(formData.annualROIProjection),

          minimumHoldingPeriod: formData.minimumHoldingPeriod,

          exitOptions: formData.exitOptions,

          // Step 4: Document Uploads

          documentsUploaded: formData.documentsUploaded,

          uploadedDocuments: uploadedDocumentUrls,

          // Step 5: Media & Marketing

          images: uploadedImageUrls,

          virtualTourLink: formData.virtualTourLink || undefined,

          requestVirtualTour: formData.requestVirtualTour,

          brochure: brochureData,

          // Step 6: Additional Highlights

          highlights: formData.highlights,

          customHighlights: formData.customHighlights || undefined,

          tenantName: formData.tenantName || undefined,

          // Step 7: Contact Information & Legal

          ownerDetails: formData.ownerDetails,

          termsAccepted: formData.termsAccepted,

          // Internal coordinates

          coordinates: formData.coordinates,
        };
        // Make API call

        const response = await fetch("/api/commercial", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(apiData),
        });

        const result = await response.json();

        console.log("RRRRRRRRRR", result);

        if (!response.ok) {
          // Handle validation errors

          if (result.details && Array.isArray(result.details)) {
            const errorMessages = result.details
              .map((detail: any) =>
                detail.field
                  ? `${detail.field}: ${detail.message}`
                  : detail.message
              )
              .join(", ");

            setError(`Validation Error: ${errorMessages}`);
          } else {
            setError(
              result.error || "An error occurred while submitting the property"
            );
          }

          setSubmitting(false);

          return;
        }

        // Success handling

        setSuccess(
          `Property submitted successfully! Reference ID: ${result.propertyId}`
        );

        // Clear saved form data on successful submission

        localStorage.removeItem("commercialPropertyFormData");

        localStorage.removeItem("commercialPropertyFormStep");

        // Redirect after a delay

        setTimeout(() => {
          router.push("/equity/property");
        }, 3000);
      } catch (err: any) {
        console.error("Submit error:", err);

        setError(
          err.message ||
            "Network error. Please check your connection and try again."
        );

        setSubmitting(false);
      }
    },
    [formData, uploadedFiles, uploadedImages, uploadedBrochure, router]
  );

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    window.location.reload();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (showAuthModal) {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
						.equity-post-page *:focus {
							border-color: #a855f7 !important;
							box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
							outline: none !important;
						}
					`,
          }}
        />
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          }
        >
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
					.equity-post-page *:focus {
						border-color: #a855f7 !important;
						box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
						outline: none !important;
					}
				`,
        }}
      />

      <div className="equity-post-page min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa]">
        <Suspense fallback={<LoadingSpinner />}>
          <EquityNavigation />
        </Suspense>

        <div className="container mx-auto px-4 py-8 pt-28 md:pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Post Commercial Property for Fractional Ownership
              </h1>
              <p className="text-purple-200 text-lg">
                List your commercial property for fractional investment
                opportunities
              </p>

              {/* Data Restoration Indicator */}
              {isRestoringData && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-200 text-sm">
                    ✓ Restoring your previous form data...
                  </p>
                </div>
              )}
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                      formStep >= step
                        ? "bg-purple-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Labels */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white">
                {formStep === 1 && "Step 1: Property Type & Category"}
                {formStep === 2 && "Step 2: Basic Property Details"}
                {formStep === 3 && "Step 3: Fractional Investment Parameters"}
                {formStep === 4 && "Step 4: Document Uploads"}
                {formStep === 5 && "Step 5: Media & Marketing"}
                {formStep === 6 && "Step 6: Additional Highlights"}
                {formStep === 7 && "Step 7: Review & Submit"}
              </h2>

              {/* Validation Status Indicator */}
              {!getCurrentStepValidation() && (
                <div className="mt-3 text-sm text-gray-300 flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Complete all required fields to continue
                </div>
              )}

              {getCurrentStepValidation() && formStep < 7 && (
                <div className="mt-3 text-sm text-green-300 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ready to proceed to next step
                </div>
              )}
            </div>

            {/* Form Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-200">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Property Type & Category */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Building2 className="w-6 h-6 mr-2 text-purple-400" />
                      Select Property Type & Category
                    </h3>

                    <div>
                      <Label
                        htmlFor="propertyType"
                        className="flex items-center mb-2"
                      >
                        Property Type
                        <span className="text-red-400 ml-2">*</span>
                      </Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            propertyType: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-purple-400/30">
                          {propertyTypes.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50"
                            >
                              <div className="flex items-center gap-2">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!formData.propertyType && (
                        <p className="text-red-300 text-sm mt-1">
                          Please select a property type
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block">Listing Category</Label>
                      <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white">
                            Fractional Ownership
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Basic Property Details */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-purple-400" />
                      Enter Basic Property Details
                    </h3>

                    <div>
                      <Label
                        htmlFor="projectName"
                        className="flex items-center mb-2"
                      >
                        Project/Asset Name
                        <span className="text-red-400 ml-1">*</span>
                      </Label>
                      <Input
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder="e.g., DLF Corporate Park"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        required
                      />
                      {!formData.projectName && (
                        <p className="text-red-300 text-sm mt-1">
                          Project name is required
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="fullAddress"
                          className="flex items-center mb-2"
                        >
                          Full Address with Pin Code
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Textarea
                          id="fullAddress"
                          name="fullAddress"
                          value={formData.fullAddress}
                          onChange={handleInputChange}
                          placeholder="Complete address with pin code"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                        {!formData.fullAddress && (
                          <p className="text-red-300 text-sm mt-1">
                            Full address is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="pinCode"
                          className="flex items-center mb-2"
                        >
                          Pin Code
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Input
                          id="pinCode"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          placeholder="110001"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                        {!formData.pinCode && (
                          <p className="text-red-300 text-sm mt-1">
                            Pin code is required
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="city"
                          className="flex items-center mb-2"
                        >
                          City
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Delhi"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="locality"
                          className="flex items-center mb-2"
                        >
                          Locality
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Select
                          value={formData.locality}
                          onValueChange={handleLocalityChange}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                            <SelectValue placeholder="Select locality" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-purple-400/30 max-h-48 overflow-y-auto">
                            {delhiAreas.map((area) => (
                              <SelectItem
                                key={area}
                                value={area}
                                className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50"
                              >
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!formData.locality && (
                          <p className="text-red-300 text-sm mt-1">
                            Please select a locality
                          </p>
                        )}
                        {formData.coordinates.latitude &&
                          formData.coordinates.longitude && (
                            <div className="mt-2 text-sm text-green-300 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              Coordinates: {formData.coordinates.latitude},{" "}
                              {formData.coordinates.longitude}
                            </div>
                          )}
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="possessionStatus"
                        className="flex items-center mb-2"
                      >
                        Possession Status
                        <span className="text-red-400 ml-1">*</span>
                      </Label>
                      <Select
                        value={formData.possessionStatus}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            possessionStatus: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                          <SelectValue placeholder="Select possession status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-purple-400/30">
                          {possessionStatusOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!formData.possessionStatus && (
                        <p className="text-red-300 text-sm mt-1">
                          Please select possession status
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="builtUpArea"
                          className="flex items-center mb-2"
                        >
                          Built-up Area (sq. ft.)
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Input
                          id="builtUpArea"
                          name="builtUpArea"
                          type="number"
                          value={formData.builtUpArea}
                          onChange={handleInputChange}
                          placeholder="e.g., 10000"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                        {!formData.builtUpArea && (
                          <p className="text-red-300 text-sm mt-1">
                            Built-up area is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="totalValuation"
                          className="flex items-center mb-2"
                        >
                          Total Valuation (₹ Cr)
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Input
                          id="totalValuation"
                          name="totalValuation"
                          type="number"
                          step="0.1"
                          value={formData.totalValuation}
                          onChange={handleInputChange}
                          placeholder="e.g., 50.5"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                        {!formData.totalValuation && (
                          <p className="text-red-300 text-sm mt-1">
                            Total valuation is required
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="minimumInvestmentTicket"
                        className="flex items-center mb-2"
                      >
                        Minimum Investment Ticket
                        <span className="text-red-400 ml-1">*</span>
                      </Label>
                      <Select
                        value={formData.minimumInvestmentTicket}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            minimumInvestmentTicket: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
                          <SelectValue placeholder="Select minimum ticket size" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-purple-400/30">
                          {investmentTicketOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!formData.minimumInvestmentTicket && (
                        <p className="text-red-300 text-sm mt-1">
                          Please select minimum investment ticket
                        </p>
                      )}
                    </div>

                    {formData.minimumInvestmentTicket === "Custom Amount" && (
                      <div>
                        <Label
                          htmlFor="customTicketAmount"
                          className="flex items-center mb-2"
                        >
                          Custom Ticket Amount (₹)
                          <span className="text-red-400 ml-1">*</span>
                        </Label>
                        <Input
                          id="customTicketAmount"
                          name="customTicketAmount"
                          type="number"
                          value={formData.customTicketAmount}
                          onChange={handleInputChange}
                          placeholder="e.g., 75000"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                        {!formData.customTicketAmount && (
                          <p className="text-red-300 text-sm mt-1">
                            Custom amount is required
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Fractional Investment Parameters */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-purple-400" />
                      Enter Fractional Investment Parameters
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="targetRaiseAmount"
                          className="mb-2 block"
                        >
                          Target Raise Amount (₹ Cr) *
                        </Label>
                        <Input
                          id="targetRaiseAmount"
                          name="targetRaiseAmount"
                          type="number"
                          step="0.1"
                          value={formData.targetRaiseAmount}
                          onChange={handleInputChange}
                          placeholder="e.g., 25.0"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ownershipSplit" className="mb-2 block">
                          Ownership Split *
                        </Label>
                        <Input
                          id="ownershipSplit"
                          name="ownershipSplit"
                          value={formData.ownershipSplit}
                          onChange={handleInputChange}
                          placeholder="e.g., 100 shares = 1% each"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="rentalYield" className="mb-2 block">
                          Rental Yield (%) *
                        </Label>
                        <Input
                          id="rentalYield"
                          name="rentalYield"
                          type="number"
                          step="0.1"
                          value={formData.rentalYield}
                          onChange={handleInputChange}
                          placeholder="e.g., 8.5"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="annualROIProjection"
                          className="mb-2 block"
                        >
                          Annual ROI Projection (%) *
                        </Label>
                        <Input
                          id="annualROIProjection"
                          name="annualROIProjection"
                          type="number"
                          step="0.1"
                          value={formData.annualROIProjection}
                          onChange={handleInputChange}
                          placeholder="e.g., 12.0"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="minimumHoldingPeriod"
                        className="mb-2 block"
                      >
                        Minimum Holding Period / Lock-in *
                      </Label>
                      <Input
                        id="minimumHoldingPeriod"
                        name="minimumHoldingPeriod"
                        value={formData.minimumHoldingPeriod}
                        onChange={handleInputChange}
                        placeholder="e.g., 3 years"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Exit Options *</Label>
                      <div className="space-y-3 mt-2">
                        {exitOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`exit-${option}`}
                              checked={formData.exitOptions.includes(option)}
                              onChange={() => handleExitOptionChange(option)}
                              className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400"
                            />
                            <Label
                              htmlFor={`exit-${option}`}
                              className="text-white"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Document Uploads */}
                {formStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-purple-400" />
                      Upload Documents (Mandatory for Verification)
                    </h3>

                    <div className="space-y-4">
                      <div className="text-white">
                        <p className="mb-4">
                          Upload the following documents (PDF or JPEG):
                        </p>
                        <ul className="space-y-2 text-purple-200">
                          <li>• Title Deed / Sale Agreement</li>
                          <li>• RERA Registration Certificate</li>
                          <li>• Occupancy Certificate</li>
                          <li>• Approved Building Plan</li>
                          <li>• Lease Agreement (if leased)</li>
                          <li>• Encumbrance Certificate</li>
                          <li>• Land Ownership Proof</li>
                          <li>• Financial Deck (optional but preferred)</li>
                        </ul>
                      </div>

                      <div
                        className={`mt-6 p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
                          isDragging
                            ? "border-purple-400 bg-purple-400/10"
                            : "border-white/30 hover:border-purple-400/50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                        <p className="text-white mb-2">
                          Drag and drop your documents here
                        </p>
                        <p className="text-purple-200 text-sm mb-4">
                          or click to browse files
                        </p>
                        <input
                          type="file"
                          id="fileUpload"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("fileUpload")?.click()
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Choose Files
                        </Button>
                      </div>

                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h5 className="text-white font-medium">
                            Uploaded Files:
                          </h5>
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-3"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                <span className="text-white text-sm">
                                  {file.name}
                                </span>
                                <span className="text-purple-200 text-xs">
                                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="documentsUploaded"
                          checked={formData.documentsUploaded}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              documentsUploaded: e.target.checked,
                            }))
                          }
                          className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400"
                        />
                        <Label
                          htmlFor="documentsUploaded"
                          className="text-white"
                        >
                          I have uploaded all required documents
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Media & Marketing */}
                {formStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <ImageIcon className="w-6 h-6 mr-2 text-purple-400" />
                      Add Media & Marketing Collateral
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <Label>
                          Upload Images (Min. 6 HD images, at least 1 exterior +
                          1 floor plan) *
                        </Label>
                        <div
                          className={`mt-2 p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
                            isImageDragging
                              ? "border-purple-400 bg-purple-400/10"
                              : "border-white/30 hover:border-purple-400/50"
                          }`}
                          onDragOver={handleImageDragOver}
                          onDragLeave={handleImageDragLeave}
                          onDrop={handleImageDrop}
                        >
                          <ImageIcon className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                          <p className="text-white mb-2">
                            Drag and drop your images here
                          </p>
                          <p className="text-purple-200 text-sm mb-4">
                            JPG, PNG, WEBP up to 10MB each
                          </p>
                          <input
                            type="file"
                            id="imageUpload"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files &&
                              handleImageUpload(e.target.files)
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              document.getElementById("imageUpload")?.click()
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Upload Images
                          </Button>
                        </div>

                        {/* Uploaded Images List */}
                        {uploadedImages.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h5 className="text-white font-medium">
                              Uploaded Images ({uploadedImages.length}):
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {uploadedImages.map((file, index) => (
                                <div
                                  key={index}
                                  className="relative bg-white/5 border border-white/20 rounded-lg p-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <ImageIcon className="w-4 h-4 text-purple-400" />
                                    <span className="text-white text-xs truncate">
                                      {file.name}
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 w-5 h-5 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="virtualTourLink" className="mb-2 block">
                          Virtual Tour Link
                        </Label>
                        <Input
                          id="virtualTourLink"
                          name="virtualTourLink"
                          value={formData.virtualTourLink}
                          onChange={handleInputChange}
                          placeholder="https://example.com/virtual-tour"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="requestVirtualTour"
                          checked={formData.requestVirtualTour}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              requestVirtualTour: e.target.checked,
                            }))
                          }
                          className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400"
                        />
                        <Label
                          htmlFor="requestVirtualTour"
                          className="text-white"
                        >
                          Request 100गज to shoot virtual tour
                        </Label>
                      </div>

                      <div>
                        <Label>Promotional Brochure PDF (max. 10 MB)</Label>
                        <div
                          className={`mt-2 p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
                            isBrochureDragging
                              ? "border-purple-400 bg-purple-400/10"
                              : "border-white/30 hover:border-purple-400/50"
                          }`}
                          onDragOver={handleBrochureDragOver}
                          onDragLeave={handleBrochureDragLeave}
                          onDrop={handleBrochureDrop}
                        >
                          <FileText className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                          <p className="text-white text-sm mb-2">
                            Drag and drop your PDF here
                          </p>
                          <input
                            type="file"
                            id="brochureUpload"
                            accept=".pdf"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleBrochureUpload(e.target.files[0])
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              document.getElementById("brochureUpload")?.click()
                            }
                            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Upload PDF
                          </Button>
                        </div>

                        {/* Uploaded Brochure */}
                        {uploadedBrochure && (
                          <div className="mt-3 bg-white/5 border border-white/20 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                <span className="text-white text-sm">
                                  {uploadedBrochure.name}
                                </span>
                                <span className="text-purple-200 text-xs">
                                  (
                                  {(
                                    uploadedBrochure.size /
                                    (1024 * 1024)
                                  ).toFixed(2)}{" "}
                                  MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={removeBrochure}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Additional Highlights */}
                {formStep === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-purple-400" />
                      Add Additional Highlights (USP Section)
                    </h3>

                    <div className="space-y-4">
                      <Label className="text-white">
                        Select all that apply:
                      </Label>
                      {highlightOptions.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={highlight}
                            checked={formData.highlights.includes(highlight)}
                            onChange={() => handleHighlightChange(highlight)}
                            className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400"
                          />
                          <Label htmlFor={highlight} className="text-white">
                            {highlight}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {formData.highlights.includes("Tenanted property") && (
                      <div>
                        <Label htmlFor="tenantName" className="mb-2 block">
                          Tenant Name (Corporate) *
                        </Label>
                        <Input
                          id="tenantName"
                          name="tenantName"
                          value={formData.tenantName}
                          onChange={handleInputChange}
                          placeholder="e.g., Infosys, TCS, etc."
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="customHighlights" className="mb-2 block">
                        Custom USPs / Additional Information
                      </Label>
                      <Textarea
                        id="customHighlights"
                        name="customHighlights"
                        value={formData.customHighlights}
                        onChange={handleInputChange}
                        placeholder="Add any additional unique selling points or custom highlights..."
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {formStep === 7 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-purple-400" />
                      Final Review & Contact Information
                    </h3>

                    {/* Property Summary */}
                    <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Property Summary
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-200">
                        <div>
                          <span className="text-white font-medium">
                            Property Type:
                          </span>{" "}
                          {formData.propertyType}
                        </div>
                        <div>
                          <span className="text-white font-medium">
                            Project Name:
                          </span>{" "}
                          {formData.projectName}
                        </div>
                        <div>
                          <span className="text-white font-medium">
                            Location:
                          </span>{" "}
                          {formData.locality}, {formData.city}
                        </div>
                        <div>
                          <span className="text-white font-medium">
                            Built-up Area:
                          </span>{" "}
                          {formData.builtUpArea} sq ft
                        </div>
                        <div>
                          <span className="text-white font-medium">
                            Total Valuation:
                          </span>{" "}
                          ₹{formData.totalValuation} Cr
                        </div>
                        <div>
                          <span className="text-white font-medium">
                            Min Investment:
                          </span>{" "}
                          {formData.minimumInvestmentTicket}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="ownerDetails.name"
                          className="mb-2 block"
                        >
                          Owner/Contact Name *
                        </Label>
                        <Input
                          id="ownerDetails.name"
                          name="ownerDetails.name"
                          value={formData.ownerDetails.name}
                          onChange={handleInputChange}
                          placeholder="Full name"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="ownerDetails.phone"
                          className="mb-2 block"
                        >
                          Phone Number *
                        </Label>
                        <Input
                          id="ownerDetails.phone"
                          name="ownerDetails.phone"
                          value={formData.ownerDetails.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="ownerDetails.email"
                          className="mb-2 block"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="ownerDetails.email"
                          name="ownerDetails.email"
                          type="email"
                          value={formData.ownerDetails.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ownerDetails.companyName">
                          Company/Organization
                        </Label>
                        <Input
                          id="ownerDetails.companyName"
                          name="ownerDetails.companyName"
                          value={formData.ownerDetails.companyName}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              termsAccepted: e.target.checked,
                            }))
                          }
                          className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400 mt-1"
                          required
                        />
                        <Label
                          htmlFor="termsAccepted"
                          className="text-white text-sm"
                        >
                          I hereby confirm that:
                          <ul className="mt-2 space-y-1 text-purple-200 text-xs">
                            <li>
                              • All information provided is accurate and
                              complete
                            </li>
                            <li>
                              • I have legal authority to list this property
                            </li>
                            <li>
                              • I accept 100गज&apos;s terms and conditions for
                              fractional ownership listing
                            </li>
                            <li>
                              • I understand the compliance requirements for
                              commercial real estate
                            </li>
                            <li>
                              • I consent to verification processes and document
                              checks
                            </li>
                          </ul>
                        </Label>
                      </div>
                    </div>

                    {/* Final Notes */}
                    <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-2">
                        Next Steps:
                      </h5>
                      <ul className="text-purple-200 text-sm space-y-1">
                        <li>
                          • Your property will be reviewed by our team within
                          2-3 business days
                        </li>
                        <li>
                          • Legal and technical verification may take 5-7
                          business days
                        </li>
                        <li>
                          • You&apos;ll receive email updates on the
                          verification status
                        </li>
                        <li>
                          • Once approved, your property will be listed for
                          fractional investment
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={formStep === 1}
                    className="bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {formStep < 7 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!getCurrentStepValidation()}
                      className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting || !getCurrentStepValidation()}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit for Verification"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          }
        >
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </Suspense>
      </div>
    </>
  );
}
