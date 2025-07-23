// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/users";
// const API_BASE_URL = "http://localhost:3000/api/users";
// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
    try {
        // Get auth token from sessionStorage if we're in a browser environment
        let token;
        if (typeof window !== "undefined") {
            token = sessionStorage.getItem("authToken");
        }
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({ "Content-Type": "application/json" }, (token ? { Authorization: `Bearer ${token}` } : {})), (options.headers || {})), credentials: "include" }));
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        return await response.json();
    }
    catch (_error) {
        throw _error;
    }
};
// User API helpers
export const UserAPI = {
    getProfile: () => apiRequest("/profile"),
    updateProfile: (userData) => apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
    }),
};
// Property API helpers
export const PropertyAPI = {
    getAll: (params) => {
        const queryString = params
            ? `?${new URLSearchParams(params).toString()}`
            : "";
        return apiRequest(`/properties${queryString}`);
    },
    getById: (id) => apiRequest(`/properties/${id}`),
    search: (query) => apiRequest(`/properties/search?q=${encodeURIComponent(query)}`),
    getRecommended: () => apiRequest("/properties/recommended"),
    getFeatured: () => apiRequest("/properties/featured"),
};
// Agent API helpers
export const AgentAPI = {
    getAll: () => apiRequest("/agents"),
    getById: (id) => apiRequest(`/agents/${id}`),
    getFeatured: () => apiRequest("/agents/featured"),
};
// Builder API helpers
export const BuilderAPI = {
    getAll: () => apiRequest("/builders"),
    getById: (id) => apiRequest(`/builders/${id}`),
    getFeatured: () => apiRequest("/builders/featured"),
};
// Locality API helpers
export const LocalityAPI = {
    getAll: () => apiRequest("/localities"),
    getById: (id) => apiRequest(`/localities/${id}`),
    getPopular: () => apiRequest("/localities/popular"),
};
// User authentication API helpers
export const AuthAPI = {
    login: (email, password) => apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    }),
    register: (userData) => apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    }),
    logout: () => apiRequest("/auth/logout", { method: "POST" }),
    getCurrentUser: () => apiRequest("/auth/me"),
};
// Favorites API helpers
export const FavoritesAPI = {
    getProperties: () => apiRequest("/favorites/properties"),
    getAgents: () => apiRequest("/favorites/agents"),
    getBuilders: () => apiRequest("/favorites/builders"),
    getProjects: () => apiRequest("/favorites/projects"),
    getLocalities: () => apiRequest("/favorites/localities"),
    addProperty: (id) => apiRequest("/favorites", {
        method: "POST",
        body: JSON.stringify({ propertyId: id }),
    }),
    removeProperty: (id) => apiRequest(`/favorites/${id}`, {
        method: "DELETE",
    }),
    addAgent: (id) => apiRequest("/favorites/agents", {
        method: "POST",
        body: JSON.stringify({ agentId: id }),
    }),
    removeAgent: (id) => apiRequest(`/favorites/agents/${id}`, {
        method: "DELETE",
    }),
    addBuilder: (id) => apiRequest("/favorites/builders", {
        method: "POST",
        body: JSON.stringify({ builderId: id }),
    }),
    removeBuilder: (id) => apiRequest(`/favorites/builders/${id}`, {
        method: "DELETE",
    }),
    addProject: (id) => apiRequest("/favorites/projects", {
        method: "POST",
        body: JSON.stringify({ projectId: id }),
    }),
    removeProject: (id) => apiRequest(`/favorites/projects/${id}`, {
        method: "DELETE",
    }),
    addLocality: (id) => apiRequest("/favorites/localities", {
        method: "POST",
        body: JSON.stringify({ localityId: id }),
    }),
    removeLocality: (id) => apiRequest(`/favorites/localities/${id}`, {
        method: "DELETE",
    }),
};
