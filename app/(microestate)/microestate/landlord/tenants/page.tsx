"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Home, Mail, Phone, Eye, Trash2, Filter, Loader2, X, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FloatingCircles, ParticleBackground, AnimatedGradient } from '../../../_components/Background';
import ProtectedRoute from '../../../_components/ProtectedRoute';
import { useAuth } from '../../../Context/AuthProvider';
import axios from 'axios';

interface Property {
  _id: string;
  title: string;
  address: string | {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  rent: number;
}

interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  property: Property;
  rentAmount: number;
  status: 'active' | 'overdue' | 'inactive';
  leaseStart: string;
  leaseEnd: string;
}

export default function TenantsPage() {
  const { data: session } = useSession();
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch tenants and properties in parallel
      const [tenantsResponse, propertiesResponse] = await Promise.all([
        axios.get('/microestate/api/landlord/tenants'),
        axios.get('/microestate/api/properties')
      ]);
      
      setTenants(tenantsResponse.data.tenants || []);
      setProperties(propertiesResponse.data.properties || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    if (!tenant.property?._id) {
      alert('Cannot delete tenant: Property information not available');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${tenant.name} from ${tenant.property.title}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingTenantId(tenant._id);
      
      const response = await axios.delete(`/microestate/api/properties/${tenant.property._id}/tenant`);
      
      if (response.data.success) {
        // Refresh the data after successful deletion
        await fetchData();
        alert('Tenant successfully removed from property');
      } else {
        throw new Error(response.data.message || 'Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to remove tenant. Please try again.');
    } finally {
      setDeletingTenantId(null);
    }
  };

  const filteredTenants = propertyFilter === 'all'
    ? tenants.filter(t => t.status !== 'inactive') // Exclude inactive/terminated tenants
    : tenants.filter(t => t.property?._id === propertyFilter && t.status !== 'inactive');

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <FloatingCircles />
      <ParticleBackground />
      <AnimatedGradient />
      <div className="container mx-auto py-4 sm:py-6 lg:py-8 mt-4 sm:mt-6 lg:mt-8 relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-6 sm:mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent">Tenants</h1>
              <p className="text-gray-400 text-sm sm:text-base">Manage your tenants and their properties</p>
            </div>
            <Link href="/microestate/landlord/tenants/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                Add Tenant
              </Button>
            </Link>
          </div>

          {/* Property Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
              <span className="text-gray-400 text-sm sm:text-base whitespace-nowrap">Filter by property:</span>
            </div>
            <select
              value={propertyFilter}
              onChange={e => setPropertyFilter(e.target.value)}
              className="w-full sm:max-w-xs px-3 sm:px-4 py-2 sm:py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-transparent transition-colors text-sm sm:text-base"
            >
              <option value="all">All Properties</option>
              {properties.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading tenants...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tenants Table */}
        {!loading && !error && (
          <section className="bg-glass border border-transparent transition-colors hover:border-transparent">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4 p-4">
              {filteredTenants.map((tenant) => (
                <div key={tenant._id} className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 hover:bg-[#222] transition-colors">
                  {/* Tenant Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl select-none">
                        {tenant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg mb-1">{tenant.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">ID: {tenant._id.slice(-6)}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{tenant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{tenant.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="mb-4 p-3 bg-[#0f0f12] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-white">{tenant.property?.title || 'N/A'}</span>
                    </div>
                    <p className="text-xs text-gray-400 pl-6">
                      {tenant.property?.address ? 
                        (typeof tenant.property.address === 'string' ? 
                          tenant.property.address : 
                          [
                            tenant.property.address.street,
                            tenant.property.address.city,
                            tenant.property.address.state
                          ].filter(Boolean).join(', ')
                        ) : 'N/A'}
                    </p>
                  </div>

                  {/* Rent and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs text-gray-400 block">Rent Amount</span>
                      <span className="text-green-400 font-semibold text-lg">₹{tenant.rentAmount?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tenant.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      tenant.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tenant.status || 'active'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-[#2a2a2f]">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 transition-colors"
                      onClick={() => setViewingTenant(tenant)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="text-sm">View</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteTenant(tenant)}
                      disabled={deletingTenantId === tenant._id}
                    >
                      {deletingTenantId === tenant._id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2f]">
                    <th className="pb-4 text-gray-400 font-semibold px-4">Tenant</th>
                    <th className="pb-4 text-gray-400 font-semibold px-4">Contact</th>
                    <th className="pb-4 text-gray-400 font-semibold px-4">Property</th>
                    <th className="pb-4 text-gray-400 font-semibold px-4">Rent Amount</th>
                    <th className="pb-4 text-gray-400 font-semibold px-4">Status</th>
                    <th className="pb-4 text-gray-400 font-semibold px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant._id} className="border-b border-[#2a2a2f] hover:bg-[#1a1a1f] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl select-none">
                              {tenant.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{tenant.name}</div>
                            <div className="text-sm text-gray-400">ID: {tenant._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-300"><Mail className="w-4 h-4" /> {tenant.email}</span>
                          <span className="inline-flex items-center gap-1 text-sm text-gray-300"><Phone className="w-4 h-4" /> {tenant.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-sm font-medium">{tenant.property?.title || 'N/A'}</span>
                            <div className="text-xs text-gray-400">
                              {tenant.property?.address ? 
                                (typeof tenant.property.address === 'string' ? 
                                  tenant.property.address : 
                                  [
                                    tenant.property.address.street,
                                    tenant.property.address.city,
                                    tenant.property.address.state
                                  ].filter(Boolean).join(', ')
                                ) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-green-400 font-semibold">₹{tenant.rentAmount?.toLocaleString() || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          tenant.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tenant.status || 'active'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 transition-colors"
                            onClick={() => setViewingTenant(tenant)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDeleteTenant(tenant)}
                            disabled={deletingTenantId === tenant._id}
                          >
                            {deletingTenantId === tenant._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTenants.length === 0 && (
              <div className="text-center py-8 sm:py-12 px-4">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No tenants found</h3>
                <p className="text-sm sm:text-base text-gray-400 mb-6">Try adjusting your filter or add a new tenant</p>
                <Link href="/microestate/landlord/tenants/add" className="inline-block w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                    Add Tenant
                  </Button>
                </Link>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Tenant Detail Modal */}
      {viewingTenant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={() => setViewingTenant(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl select-none">
                  {viewingTenant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{viewingTenant.name}</h2>
                <p className="text-gray-400">Tenant ID: {viewingTenant._id.slice(-6)}</p>
              </div>
            </div>

            {/* Tenant Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Contact Info */}
              <div className="bg-[#0f0f12] rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{viewingTenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{viewingTenant.phone}</span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-[#0f0f12] rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-orange-400" />
                  Property Details
                </h3>
                <div className="space-y-2">
                  <div className="text-white font-medium">{viewingTenant.property?.title || 'N/A'}</div>
                  <div className="text-gray-400 text-sm">
                    {viewingTenant.property?.address ? 
                      (typeof viewingTenant.property.address === 'string' ? 
                        viewingTenant.property.address : 
                        [
                          viewingTenant.property.address.street,
                          viewingTenant.property.address.city,
                          viewingTenant.property.address.state
                        ].filter(Boolean).join(', ')
                      ) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Lease Info */}
              <div className="bg-[#0f0f12] rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Lease Information
                </h3>
                <div className="space-y-2">
                  <div className="text-gray-300 text-sm">
                    <span className="text-gray-400">Start Date:</span> {new Date(viewingTenant.leaseStart).toLocaleDateString()}
                  </div>
                  <div className="text-gray-300 text-sm">
                    <span className="text-gray-400">End Date:</span> {new Date(viewingTenant.leaseEnd).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      viewingTenant.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      viewingTenant.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {viewingTenant.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#0f0f12] rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-400" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="text-green-400 font-semibold text-lg">
                    ₹{viewingTenant.rentAmount?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-gray-400 text-sm">Monthly Rent</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                onClick={() => {
                  // Add edit functionality here
                  alert('Edit functionality coming soon');
                }}
              >
                Edit Tenant
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  setViewingTenant(null);
                  handleDeleteTenant(viewingTenant);
                }}
              >
                Remove Tenant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 