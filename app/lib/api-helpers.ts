// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/users";
// const API_BASE_URL = "http://localhost:3000/api/users";

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Get auth token from sessionStorage if we're in a browser environment
    let token;
    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("authToken");
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (_error) {

    throw _error;
  }
};

// User API helpers
export const UserAPI = {
  getProfile: () => apiRequest("/profile"),
  updateProfile: (userData: any) =>
    apiRequest("/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// Property API helpers
export const PropertyAPI = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return apiRequest(`/properties${queryString}`);
  },
  getById: (id: string) => apiRequest(`/properties/${id}`),
  search: (query: string) =>
    apiRequest(`/properties/search?q=${encodeURIComponent(query)}`),
  getRecommended: () => apiRequest("/properties/recommended"),
  getFeatured: () => apiRequest("/properties/featured"),
};

// Agent API helpers
export const AgentAPI = {
  getAll: () => apiRequest("/agents"),
  getById: (id: string) => apiRequest(`/agents/${id}`),
  getFeatured: () => apiRequest("/agents/featured"),
};

// Builder API helpers
export const BuilderAPI = {
  getAll: () => apiRequest("/builders"),
  getById: (id: string) => apiRequest(`/builders/${id}`),
  getFeatured: () => apiRequest("/builders/featured"),
};

// Locality API helpers
export const LocalityAPI = {
  getAll: () => apiRequest("/localities"),
  getById: (id: string) => apiRequest(`/localities/${id}`),
  getPopular: () => apiRequest("/localities/popular"),
};

// User authentication API helpers
export const AuthAPI = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (userData: any) =>
    apiRequest("/auth/register", {
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

  addProperty: (id: string) =>
    apiRequest("/favorites", {
      method: "POST",
      body: JSON.stringify({ propertyId: id }),
    }),
  removeProperty: (id: string) =>
    apiRequest(`/favorites/${id}`, {
      method: "DELETE",
    }),

  addAgent: (id: string) =>
    apiRequest("/favorites/agents", {
      method: "POST",
      body: JSON.stringify({ agentId: id }),
    }),
  removeAgent: (id: string) =>
    apiRequest(`/favorites/agents/${id}`, {
      method: "DELETE",
    }),

  addBuilder: (id: string) =>
    apiRequest("/favorites/builders", {
      method: "POST",
      body: JSON.stringify({ builderId: id }),
    }),
  removeBuilder: (id: string) =>
    apiRequest(`/favorites/builders/${id}`, {
      method: "DELETE",
    }),

  addProject: (id: string) =>
    apiRequest("/favorites/projects", {
      method: "POST",
      body: JSON.stringify({ projectId: id }),
    }),
  removeProject: (id: string) =>
    apiRequest(`/favorites/projects/${id}`, {
      method: "DELETE",
    }),

  addLocality: (id: string) =>
    apiRequest("/favorites/localities", {
      method: "POST",
      body: JSON.stringify({ localityId: id }),
    }),
  removeLocality: (id: string) =>
    apiRequest(`/favorites/localities/${id}`, {
      method: "DELETE",
    }),
};
