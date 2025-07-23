"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Building,
  AreaChart,
  Bed,
  Droplets,
  Car,
  School,
  ArrowUp,
  Wrench,
  MapPin,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import SearchDropdown from "@/components/ui/search-dropdown";

export default function HousePricePrediction() {
  // Remove the useToast hook call since we're using sonner now
  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    area: "",
    bedrooms: "",
    resale: "1",
    swimmingpool: "0",
    carparking: "1",
    school: "1",
    lift: "1",
    maintenance: "1",
    location: "",
    city: "Bangalore",
  });
  
  // Load location and city data
  useEffect(() => {
    // Fetch locations
    fetch('/location_mapping.json')
      .then(response => response.json())
      .then(data => {
        setLocations(data);
      })
      .catch(error => {

        setLocations([]);
      });
      
    // Fetch city data
    fetch('/city_mapping.json')
      .then(response => response.json())
      .then(data => {
        setCities(Object.keys(data));
      })
      .catch(error => {

        setCities(["Banglore", "Chennai", "Delhi", "Hyderabad", "Kolkata", "Mumbai"]);
      });
  }, []);

  const handleInputChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = _e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (_e: React.FormEvent) => {
    _e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);

    try {
      // Create the payload object with proper types
      const payload = {
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        resale: Number(formData.resale),
        swimmingpool: Number(formData.swimmingpool),
        carparking: Number(formData.carparking),
        school: Number(formData.school),
        lift: Number(formData.lift),
        maintenance: Number(formData.maintenance),
        location: formData.location,
        city: formData.city,
      };

      const response = await fetch(
        "https://indian-house-price-predection.onrender.com/predict_api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`Failed to predict price: ${errorText}`);
      }

      const responseText = await response.text();

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (_e) {

        throw new Error("Invalid response format from server");
      }

      // Check if the predicted price is available and handle different response formats
      if (
        data &&
        (data.predicted_price_lakhs !== undefined ||
          data.predicted_price_lakhs !== null)
      ) {
        // Make sure we convert to a number if it's not already
        const price =
          typeof data.predicted_price_lakhs === "string"
            ? parseFloat(data.predicted_price_lakhs)
            : Number(data.predicted_price_lakhs);

        setPredictedPrice(price);
      } else {

        throw new Error("Could not find predicted price in response");
      }
    } catch (_error) {

      toast.error(`Failed to predict house price. Please try again.${_error}`);
    } finally {
      setLoading(false);
    }
  };

  // Custom icon component with color and styling
  const FeatureIcon = ({
    icon: Icon,
    active,
  }: {
    icon: any;
    active: boolean;
  }) => (
    <div
      className={`p-2 rounded-full ${active ? "bg-orange-500" : "bg-neutral-800"}
                   transition-all duration-300 items-center`}
    >
      <Icon size={16} className={active ? "text-white" : "text-neutral-400"} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto my-20 mb-32">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Home className="text-orange-500" size={32} />
            <span>
              House Price <span className="text-orange-500">Predictor</span>
            </span>
          </h1>
          <p className="text-neutral-400">
            Discover the market value of your dream property in seconds
          </p>
        </div>

        <Card className="bg-neutral-900 border-none shadow-lg shadow-orange-500/10">
          <CardHeader className="border-b border-neutral-800 pb-6">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="text-orange-500" />
              Property Details
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter property specifications to receive an AI-driven price
              estimate
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Area Input */}
                <div className="space-y-2 relative group">
                  <Label
                    htmlFor="area"
                    className="text-neutral-400 flex items-center gap-2"
                  >
                    <AreaChart size={14} className="text-orange-500" />
                    Area (sq ft)
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter area in square feet"
                    required
                    className="bg-neutral-800 border-neutral-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-focus-within:w-full transition-all duration-300"></div>
                </div>

                {/* Bedrooms Input */}
                <div className="space-y-2 relative group">
                  <Label
                    htmlFor="bedrooms"
                    className="text-neutral-400 flex items-center gap-2"
                  >
                    <Bed size={14} className="text-orange-500" />
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bedrooms"
                    required
                    className="bg-neutral-800 border-neutral-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                {/* Location Input */}
                <div className="space-y-2 relative group">
                  <Label
                    htmlFor="location"
                    className="text-neutral-400 flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-orange-500" />
                    Location
                  </Label>
                  <SearchDropdown
                    name="location"
                    placeholder="Search for a location..."
                    options={locations}
                    value={formData.location}
                    onChangeAction={(value) => handleSelectChange("location", value)}
                    required
                    icon={<MapPin size={14} />}
                  />
                </div>

                {/* City Input */}
                <div className="space-y-2 relative group">
                  <Label
                    htmlFor="city"
                    className="text-neutral-400 flex items-center gap-2"
                  >
                    <Building size={14} className="text-orange-500" />
                    City
                  </Label>
                  <SearchDropdown
                    name="city"
                    placeholder="Search for a city..."
                    options={cities}
                    value={formData.city}
                    onChangeAction={(value) => handleSelectChange("city", value)}
                    required
                    icon={<Building size={14} />}
                  />
                </div>
              </div>

              {/* Feature toggles section */}
              <div className="mt-8 pt-6 border-t border-neutral-800">
                <h3 className="text-lg font-medium mb-4">Property Features</h3>
                <div className="grid grid-cols-2 gap-4 justify-items-center">
                  {/* Resale */}
                  <div
                    className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer w-full max-w-xs"
                    onClick={() =>
                      handleSelectChange(
                        "resale",
                        formData.resale === "1" ? "0" : "1",
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FeatureIcon
                        icon={Home}
                        active={formData.resale === "1"}
                      />
                      <div className="text-center">
                        <p className="font-medium">Resale Property</p>
                        <p className="text-xs text-neutral-400">
                          {formData.resale === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Swimming Pool */}
                  <div
                    className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer w-full max-w-xs"
                    onClick={() =>
                      handleSelectChange(
                        "swimmingpool",
                        formData.swimmingpool === "1" ? "0" : "1",
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FeatureIcon
                        icon={Droplets}
                        active={formData.swimmingpool === "1"}
                      />
                      <div className="text-center">
                        <p className="font-medium">Swimming Pool</p>
                        <p className="text-xs text-neutral-400">
                          {formData.swimmingpool === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Car Parking */}
                  <div
                    className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer w-full max-w-xs"
                    onClick={() =>
                      handleSelectChange(
                        "carparking",
                        formData.carparking === "1" ? "0" : "1",
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FeatureIcon
                        icon={Car}
                        active={formData.carparking === "1"}
                      />
                      <div className="text-center">
                        <p className="font-medium">Car Parking</p>
                        <p className="text-xs text-neutral-400">
                          {formData.carparking === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* School Nearby */}
                  <div
                    className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer w-full max-w-xs"
                    onClick={() =>
                      handleSelectChange(
                        "school",
                        formData.school === "1" ? "0" : "1",
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FeatureIcon
                        icon={School}
                        active={formData.school === "1"}
                      />
                      <div className="text-center">
                        <p className="font-medium">School Nearby</p>
                        <p className="text-xs text-neutral-400">
                          {formData.school === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lift */}
                  <div
                    className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer w-full max-w-xs"
                    onClick={() =>
                      handleSelectChange(
                        "lift",
                        formData.lift === "1" ? "0" : "1",
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FeatureIcon
                        icon={ArrowUp}
                        active={formData.lift === "1"}
                      />
                      <div className="text-center">
                        <p className="font-medium">Lift Available</p>
                        <p className="text-xs text-neutral-400">
                          {formData.lift === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div
                    className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer w-full max-w-xs"
                    onClick={() =>
                      handleSelectChange(
                        "maintenance",
                        formData.maintenance === "1" ? "0" : "1",
                      )
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FeatureIcon
                        icon={Wrench}
                        active={formData.maintenance === "1"}
                      />
                      <div className="text-center">
                        <p className="font-medium">Maintenance</p>
                        <p className="text-xs text-neutral-400">
                          {formData.maintenance === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing market data...</span>
                  </div>
                ) : (
                  <span className="text-lg font-medium">
                    Predict Property Price
                  </span>
                )}
              </Button>
            </form>

            {predictedPrice !== null && (
              <div className="mt-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-xl"></div>
                <div className="relative bg-neutral-800 border border-orange-500/30 rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-300">
                        Estimated Market Value
                      </h3>
                      <p className="text-4xl font-bold text-white mt-2">
                        <span className="text-orange-500">₹</span>
                        {typeof predictedPrice === "number"
                          ? predictedPrice.toLocaleString()
                          : predictedPrice}{" "}
                        Lakhs
                      </p>
                      <p className="text-xs text-neutral-400 mt-2">
                        *Based on current market trends and AI analysis
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
                        <Home size={32} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
