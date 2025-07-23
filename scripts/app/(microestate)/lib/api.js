import { useSession } from "next-auth/react";
import { useCallback } from "react";
/**
 * Makes an authenticated API request
 * @param options Request options or URL string
 * @param session Optional session object containing the auth token
 * @returns Promise with the response data
 */
export async function apiRequest(options, session) {
    // Handle string URL shorthand
    const requestOptions = typeof options === "string" ? { url: options } : options;
    // Get token from options or session
    const token = requestOptions.token || (session === null || session === void 0 ? void 0 : session.microauthToken);
    // Set up headers
    const headers = Object.assign(Object.assign({ "Content-Type": "application/json" }, (token && { Authorization: `Bearer ${token}` })), requestOptions.headers);
    // Prepare request config
    const config = Object.assign({ method: requestOptions.method || "GET", headers }, (requestOptions.body && {
        body: typeof requestOptions.body === "string"
            ? requestOptions.body
            : JSON.stringify(requestOptions.body),
    }));
    try {
        const response = await fetch(requestOptions.url, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.message || `API request failed with status ${response.status}`);
            error.status = response.status;
            throw error;
        }
        // Handle empty responses
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return null;
        }
        return (await response.json());
    }
    catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
}
/**
 * Hook for making authenticated API requests in React components
 * @returns Object containing the apiRequest function and loading state
 */
export function useApi() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const makeRequest = useCallback(async (options) => {
        return apiRequest(options, session);
    }, [session]);
    return {
        /**
         * Make an authenticated API request
         * @param options Request options or URL string
         * @returns Promise with the response data
         */
        apiRequest: makeRequest,
        /**
         * Loading state of the session
         */
        isLoading,
    };
}
// Example usage in a component:
/*
'use client';
import { useApi } from '@/app/(microestate)/lib/api';

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function UserProfile() {
  const { apiRequest, isLoading } = useApi();
  
  const fetchUserData = async () => {
    try {
      const userData = await apiRequest<UserData>({
        url: '/api/user/profile',
        method: 'GET',
      });
      console.log('User data:', userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Handle error appropriately
    }
  };
  
  // Rest of your component
}
*/
