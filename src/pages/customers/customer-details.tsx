import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Phone, Mail, MapPin, User, Building } from 'lucide-react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface POC {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  designation?: string;
  location?: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  gstNo: string;
}

function getInitials(name: string | null | undefined) {
  if (!name) return '--';
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [pocs, setPocs] = useState<POC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch customer details
        const customerRes = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.customers.byId}/${id}`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
          },
        });

        if (!customerRes.ok) throw new Error('Failed to fetch customer details');
        const customerData = await customerRes.json();
        setCustomer(customerData.data?.customer || customerData.data);

        // Fetch POCs for this customer
        const pocsRes = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.customers.byId}/${id}/users`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
          },
        });

        if (!pocsRes.ok) throw new Error('Failed to fetch POCs');
        const pocsData = await pocsRes.json();
        setPocs(pocsData.data?.users || []);
        
      } catch (err: any) {
        setError(err.message || 'Failed to fetch customer details');
        console.error('Error fetching customer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
        <Button onClick={() => navigate('/customers')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-gray-600 text-lg font-semibold mb-4">Customer not found</div>
        <Button onClick={() => navigate('/customers')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/customers')} 
            variant="ghost" 
            size="sm"
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-1">Customer Details</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled
              style={{cursor: "none"}}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Company Name</label>
                <p className="text-gray-900 font-medium">{customer.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </label>
                <p className="text-gray-900">{customer.address}</p>
              </div>
              
              {customer.gstNo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">GST Number</label>
                  <p className="text-gray-900 font-mono">{customer.gstNo}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POCs List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Points of Contact ({pocs.length})
                </h2>
              </div>
            </div>

            {pocs.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No contacts found</p>
                <p className="text-gray-400 text-sm">This customer doesn't have any POCs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pocs.map((poc) => (
                  <div 
                    key={poc.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {getInitials(poc.name)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {poc.name}
                        </h3>
                        
                        {poc.designation && (
                          <p className="text-gray-600 text-sm mb-2">
                            {poc.designation}
                          </p>
                        )}
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{poc.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{poc.mobileNo}</span>
                          </div>
                          
                                                     <div className="flex items-center gap-2 text-sm text-gray-600">
                             <MapPin className="h-4 w-4" />
                             <span>{poc.location || '-'}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails; 