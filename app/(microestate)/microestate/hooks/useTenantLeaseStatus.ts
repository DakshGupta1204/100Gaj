import { useState, useEffect } from 'react';
import axios from 'axios';

interface LeaseStatus {
  hasActiveLeases: boolean;
  wasRemoved: boolean;
  removalMessage?: string;
  leases?: any[];
}

export function useTenantLeaseStatus(userId?: string) {
  const [status, setStatus] = useState<LeaseStatus>({
    hasActiveLeases: false,
    wasRemoved: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLeaseStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("/microestate/api/tenants/property");
        
        if (response.data.hasTerminatedLeases === true && response.data.activeLeases?.length === 0) {
          // Tenant was removed from property
          setStatus({
            hasActiveLeases: false,
            wasRemoved: true,
            removalMessage: response.data.message || "You have been removed from your property."
          });
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          // Has active leases
          setStatus({
            hasActiveLeases: true,
            wasRemoved: false,
            leases: response.data
          });
        } else {
          // No leases found
          setStatus({
            hasActiveLeases: false,
            wasRemoved: false
          });
          setError("No active lease found for your account.");
        }
      } catch (err: any) {
        console.error("Error checking tenant lease status:", err);
        if (err.response?.status === 404) {
          setStatus({
            hasActiveLeases: false,
            wasRemoved: false
          });
          setError("No property assigned to this tenant account.");
        } else {
          setError(err.response?.data?.message || "Failed to check lease status.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkLeaseStatus();
  }, [userId]);

  return { status, loading, error, refetch: () => window.location.reload() };
}
