"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function VerificationRequestForm() {
    const { data: session } = useSession();
    const router = useRouter();
    // Remove the useToast hook call since we're using sonner now
    const [token, setToken] = useState(null);
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const authtoken = sessionStorage.getItem("authToken");
        if (authtoken) {
            setToken(authtoken);
        }
    }, [session, router]);
    const [requestStatus, setRequestStatus] = useState({
        agent: "idle",
        builder: "idle",
    });
    // Agent form state
    const [agentForm, setAgentForm] = useState({
        licenseNumber: "",
        agency: "",
        experience: "",
        specializations: "",
        languages: "",
        additionalInfo: "",
        image: null,
    });
    // Builder form state
    const [builderForm, setBuilderForm] = useState({
        companyName: "",
        established: "",
        headquarters: "",
        specialization: "",
        additionalInfo: "",
        logo: null,
        image: null,
    });
    // Image preview states
    const [agentImagePreview, setAgentImagePreview] = useState(null);
    const [builderImagePreview, setBuilderImagePreview] = useState(null);
    const [builderLogoPreview, setBuilderLogoPreview] = useState(null);
    // Check for existing requests
    useEffect(() => {
        const checkExistingRequests = async () => {
            if (!session || !token)
                return;
            try {
                // Fetch user's existing requests
                const response = await fetch("/api/requests/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const { requests, } = await response.json();
                    // Update statuses based on existing requests
                    const newStatus = { agent: "idle", builder: "idle" };
                    requests.forEach((request) => {
                        if (request.status === "pending") {
                            newStatus[request.type] = "pending";
                        }
                        else if (request.status === "approved") {
                            newStatus[request.type] = "success";
                        }
                    });
                    setRequestStatus(newStatus);
                }
            }
            catch (error) {
                console.error('Failed to check existing requests:', error);
            }
        };
        if (session && token) {
            checkExistingRequests();
        }
    }, [session, token]);
    // Handle image upload for agent
    const handleAgentImageChange = (_e) => {
        if (_e.target.files && _e.target.files[0]) {
            const file = _e.target.files[0];
            setAgentForm(Object.assign(Object.assign({}, agentForm), { image: file }));
            setAgentImagePreview(URL.createObjectURL(file));
        }
    };
    // Handle image upload for builder
    const handleBuilderImageChange = (_e) => {
        if (_e.target.files && _e.target.files[0]) {
            const file = _e.target.files[0];
            setBuilderForm(Object.assign(Object.assign({}, builderForm), { image: file }));
            setBuilderImagePreview(URL.createObjectURL(file));
        }
    };
    // Handle logo upload for builder
    const handleBuilderLogoChange = (_e) => {
        if (_e.target.files && _e.target.files[0]) {
            const file = _e.target.files[0];
            setBuilderForm(Object.assign(Object.assign({}, builderForm), { logo: file }));
            setBuilderLogoPreview(URL.createObjectURL(file));
        }
    };
    // Function to upload image
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to upload image");
        }
        return data.url;
    };
    // Handle agent form submission
    const handleAgentSubmit = async (_e) => {
        _e.preventDefault();
        if (!token) {
            toast.error("Authentication Error: Please log in again");
            router.push("/login");
            return;
        }
        setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { agent: "loading" })));
        try {
            let imageUrl = "";
            if (agentForm.image) {
                imageUrl = await uploadImage(agentForm.image);
            }
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: "agent",
                    requestDetails: {
                        licenseNumber: agentForm.licenseNumber,
                        agency: agentForm.agency,
                        experience: parseInt(agentForm.experience) || 0,
                        specializations: agentForm.specializations
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        languages: agentForm.languages
                            .split(",")
                            .map((l) => l.trim())
                            .filter(Boolean),
                        additionalInfo: agentForm.additionalInfo,
                        agentImage: imageUrl,
                    },
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Request submitted: Your agent verification request has been submitted successfully");
                setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { agent: "pending" })));
                // Reset form
                setAgentForm({
                    licenseNumber: "",
                    agency: "",
                    experience: "",
                    specializations: "",
                    languages: "",
                    additionalInfo: "",
                    image: null,
                });
                setAgentImagePreview(null);
            }
            else {
                toast.error(`Error: ${data.message || data.error || "Failed to submit request"}`);
                setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { agent: "error" })));
            }
        }
        catch (_error) {
            toast.error(`Error: ${_error instanceof Error
                ? _error.message
                : "Failed to submit verification request"}`);
            setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { agent: "error" })));
        }
    };
    // Handle builder form submission
    const handleBuilderSubmit = async (_e) => {
        _e.preventDefault();
        if (!token) {
            toast.error("Authentication Error: Please log in again");
            router.push("/login");
            return;
        }
        setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { builder: "loading" })));
        try {
            let imageUrl = "";
            let logoUrl = "";
            if (builderForm.image) {
                imageUrl = await uploadImage(builderForm.image);
            }
            if (builderForm.logo) {
                logoUrl = await uploadImage(builderForm.logo);
            }
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: "builder",
                    requestDetails: {
                        companyName: builderForm.companyName,
                        established: builderForm.established,
                        headquarters: builderForm.headquarters,
                        specialization: builderForm.specialization,
                        additionalInfo: builderForm.additionalInfo,
                        builderImage: imageUrl,
                        logo: logoUrl,
                    },
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Request submitted: Your builder verification request has been submitted successfully");
                setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { builder: "pending" })));
                // Reset form
                setBuilderForm({
                    companyName: "",
                    established: "",
                    headquarters: "",
                    specialization: "",
                    additionalInfo: "",
                    logo: null,
                    image: null,
                });
                setBuilderImagePreview(null);
                setBuilderLogoPreview(null);
            }
            else {
                toast.error(`Error: ${data.message || data.error || "Failed to submit request"}`);
                setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { builder: "error" })));
            }
        }
        catch (_error) {
            toast.error(`Error: ${_error instanceof Error
                ? _error.message
                : "Failed to submit verification request"}`);
            setRequestStatus((prev) => (Object.assign(Object.assign({}, prev), { builder: "error" })));
        }
    };
    // Handle agent form input changes
    const handleAgentChange = (_e) => {
        setAgentForm(Object.assign(Object.assign({}, agentForm), { [_e.target.name]: _e.target.value }));
    };
    // Handle builder form input changes
    const handleBuilderChange = (_e) => {
        setBuilderForm(Object.assign(Object.assign({}, builderForm), { [_e.target.name]: _e.target.value }));
    };
    return (<div className="bg-black text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-orange-500">
        Request Verification
      </h2>

      <Tabs defaultValue="agent">
        <TabsList className="mb-6 border-b border-orange-500">
          <TabsTrigger value="agent" className="text-orange-500 border-b-2 border-transparent hover:border-orange-500">
            Become an Agent
          </TabsTrigger>
          <TabsTrigger value="builder" className="text-orange-500 border-b-2 border-transparent hover:border-orange-500">
            Become a Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agent">
          {requestStatus.agent === "pending" ? (<div className="text-center py-8">
              <div className="mb-4 text-yellow-500">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-orange-500">
                Your Agent Verification Request is Pending
              </h3>
              <p className="text-gray-400 mb-6">
                Our team is reviewing your request. We&apos;ll notify you once
                it&apos;s approved.
              </p>
            </div>) : requestStatus.agent === "success" ? (<div className="text-center py-8">
              <div className="mb-4 text-green-500">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-orange-500">
                Request Submitted Successfully
              </h3>
              <p className="text-gray-400 mb-6">
                Your agent verification request has been submitted. We&apos;ll
                notify you once it&apos;s reviewed.
              </p>
            </div>) : (<form onSubmit={handleAgentSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agency" className="text-orange-500">
                    Agency/Company Name
                  </Label>
                  <Input id="agency" name="agency" value={agentForm.agency} onChange={handleAgentChange} placeholder="Enter your agency name" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-orange-500">
                    License Number (if applicable)
                  </Label>
                  <Input id="licenseNumber" name="licenseNumber" value={agentForm.licenseNumber} onChange={handleAgentChange} placeholder="Enter your license number" className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-orange-500">
                    Years of Experience
                  </Label>
                  <Input id="experience" name="experience" type="number" value={agentForm.experience} onChange={handleAgentChange} placeholder="Enter years of experience" min="0" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specializations" className="text-orange-500">
                    Specializations (comma-separated)
                  </Label>
                  <Input id="specializations" name="specializations" value={agentForm.specializations} onChange={handleAgentChange} placeholder="e.g. Residential, Commercial, Rentals" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages" className="text-orange-500">
                    Languages (comma-separated)
                  </Label>
                  <Input id="languages" name="languages" value={agentForm.languages} onChange={handleAgentChange} placeholder="e.g. English, Hindi, Gujarati" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="additionalInfo" className="text-orange-500">
                    Additional Information
                  </Label>
                  <Textarea id="additionalInfo" name="additionalInfo" value={agentForm.additionalInfo} onChange={handleAgentChange} placeholder="Tell us more about your experience and why you should be verified" rows={4} className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="agentImage" className="text-orange-500">
                    Profile Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-800">
                      {agentImagePreview ? (<Image src={agentImagePreview} alt="Agent preview" fill sizes="96px" className="object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Upload className="w-8 h-8"/>
                        </div>)}
                    </div>
                    <div>
                      <input type="file" id="agentImage" accept="image/*" onChange={handleAgentImageChange} className="hidden"/>
                      <Label htmlFor="agentImage" className="cursor-pointer inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500/10">
                        <Upload className="w-4 h-4 mr-2"/>
                        Upload Image
                      </Label>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <Button type="submit" className="w-full sm:w-auto bg-orange-500 text-black hover:bg-orange-600" disabled={requestStatus.agent === "loading"}>
                  {requestStatus.agent === "loading" ? (<>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      Submitting...
                    </>) : ("Submit Agent Verification Request")}
                </Button>
              </div>
            </form>)}
        </TabsContent>

        <TabsContent value="builder">
          {requestStatus.builder === "pending" ? (<div className="text-center py-8">
              <div className="mb-4 text-yellow-500">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-orange-500">
                Your Builder Verification Request is Pending
              </h3>
              <p className="text-gray-400 mb-6">
                Our team is reviewing your request. We&apos;ll notify you once
                it&apos;s approved.
              </p>
            </div>) : requestStatus.builder === "success" ? (<div className="text-center py-8">
              <div className="mb-4 text-green-500">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-orange-500">
                Request Submitted Successfully
              </h3>
              <p className="text-gray-400 mb-6">
                Your builder verification request has been submitted. We&apos;ll
                notify you once it&apos;s reviewed.
              </p>
            </div>) : (<form onSubmit={handleBuilderSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-orange-500">
                    Company Name
                  </Label>
                  <Input id="companyName" name="companyName" value={builderForm.companyName} onChange={handleBuilderChange} placeholder="Enter your company name" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="established" className="text-orange-500">
                    Year Established
                  </Label>
                  <Input id="established" name="established" value={builderForm.established} onChange={handleBuilderChange} placeholder="e.g. 2010" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquarters" className="text-orange-500">
                    Headquarters
                  </Label>
                  <Input id="headquarters" name="headquarters" value={builderForm.headquarters} onChange={handleBuilderChange} placeholder="e.g. Mumbai, Maharashtra" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-orange-500">
                    Specialization
                  </Label>
                  <Input id="specialization" name="specialization" value={builderForm.specialization} onChange={handleBuilderChange} placeholder="e.g. Residential, Commercial, Luxury" required className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="additionalInfo" className="text-orange-500">
                    Additional Information
                  </Label>
                  <Textarea id="additionalInfo" name="additionalInfo" value={builderForm.additionalInfo} onChange={handleBuilderChange} placeholder="Tell us more about your company and why you should be verified" rows={4} className="bg-gray-800 text-white border-gray-700"/>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="builderImage" className="text-orange-500">
                    Company Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-800">
                      {builderImagePreview ? (<Image src={builderImagePreview} alt="Builder preview" fill sizes="96px" className="object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Upload className="w-8 h-8"/>
                        </div>)}
                    </div>
                    <div>
                      <input type="file" id="builderImage" accept="image/*" onChange={handleBuilderImageChange} className="hidden"/>
                      <Label htmlFor="builderImage" className="cursor-pointer inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500/10">
                        <Upload className="w-4 h-4 mr-2"/>
                        Upload Image
                      </Label>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="builderLogo" className="text-orange-500">
                    Company Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-800">
                      {builderLogoPreview ? (<Image src={builderLogoPreview} alt="Logo preview" fill sizes="96px" className="object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Upload className="w-8 h-8"/>
                        </div>)}
                    </div>
                    <div>
                      <input type="file" id="builderLogo" accept="image/*" onChange={handleBuilderLogoChange} className="hidden"/>
                      <Label htmlFor="builderLogo" className="cursor-pointer inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500/10">
                        <Upload className="w-4 h-4 mr-2"/>
                        Upload Logo
                      </Label>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <Button type="submit" className="w-full sm:w-auto bg-orange-500 text-black hover:bg-orange-600" disabled={requestStatus.builder === "loading"}>
                  {requestStatus.builder === "loading" ? (<>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      Submitting...
                    </>) : ("Submit Builder Verification Request")}
                </Button>
              </div>
            </form>)}
        </TabsContent>
      </Tabs>
    </div>);
}
