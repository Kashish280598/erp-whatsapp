import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Info, Edit, Trash2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/custom/table/data-table";
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';

interface POC {
  name: string;
  phone: string;
  designation?: string;
}
interface Customer {
  id: string;
  companyName: string;
  address: string;
  gst: string;
  pocs: POC[];
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

// Helper to fetch POCs for a customer
const useCustomerPOCs = (customerId: number | string) => {
  const [pocs, setPocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const fetchPOCs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_CONFIG.baseURL + API_ENDPOINTS.customers.byId}/${customerId}/users`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch POCs');
        const apiData = await res.json();
        if (isMounted) setPocs(apiData.data?.users || []);
      } catch {
        if (isMounted) setPocs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPOCs();
    return () => { isMounted = false; };
  }, [customerId]);
  return { pocs, loading };
};

const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: string }[]>([]);
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Fetch all customers from API by getting all pages
    const fetchAllCustomers = async () => {
      setLoading(true);
      try {
        let allCustomers: any[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        // Fetch all pages
        while (hasMorePages) {
          const url = `${API_CONFIG.baseURL + API_ENDPOINTS.customers.all}?page=${currentPage}&limit=10`;
          console.log(`Fetching customers page ${currentPage}:`, url);
          
          const res = await fetch(url, {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
            },
          });
          
          if (!res.ok) throw new Error('Failed to fetch customers');
          const apiData = await res.json();
          console.log(`Customers page ${currentPage} response:`, apiData);
          
          if (!apiData.data || !Array.isArray(apiData.data.customers)) {
            throw new Error('Invalid API response format');
          }
          
          // Add customers from this page
          allCustomers = [...allCustomers, ...apiData.data.customers];
          
          // Check if there are more pages
          const totalCount = apiData.data.totalCount || apiData.data.count || 0;
          const currentPageCount = apiData.data.customers.length;
          
          if (allCustomers.length >= totalCount || currentPageCount === 0) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        }
        
        console.log('All customers fetched:', allCustomers);
        setCustomers(allCustomers);
        setFetchError(null);
      } catch (err: any) {
        setFetchError(err.message || 'Failed to fetch customers');
        setCustomers([]);
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCustomers();
  }, []);

  // Delete customer function
  const handleDeleteClick = (customer: any) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete?.id) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_CONFIG.baseURL + API_ENDPOINTS.customers.byId}/${customerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
        },
      });

      if (!res.ok) throw new Error('Failed to delete customer');

      // Remove the customer from the local state
      setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== customerToDelete.id));
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete customer:', err);
      setFetchError(err.message || 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };

  const columns = [
    {
      id: "companyName",
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }: { row: any }) => (
        <button
          className="font-semibold text-blue-700 text-[14px] hover:text-blue-900 transition-colors focus:outline-none"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          {row.original.name}
        </button>
      ),
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "address",
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: { row: any }) => <span className="text-[13px]">{row.original.address || 'N/A'}</span>,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "gst",
      accessorKey: "gst",
      header: "GST / Business ID",
      cell: ({ row }: { row: any }) => <span className="text-[13px]">{row.original.gstNo || 'N/A'}</span>,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "pocs",
      header: "POCs",
      cell: ({ row }: { row: any }) => {
        const customerId = row.original.id;
        const { pocs, loading } = useCustomerPOCs(customerId);
        if (loading) return <span className="text-gray-400 text-xs">Loading...</span>;
        const initials = pocs.slice(0, 2).map((poc: any, idx: number) => (
          <span
            key={poc.name}
            className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs w-7 h-7 mr-1 border border-blue-200"
            style={{ zIndex: 10 - idx, marginLeft: idx === 0 ? 0 : -8 }}
          >
            {getInitials(poc.name)}
          </span>
        ));
        const extraCount = pocs.length - 2;
        const extra = extraCount > 0 ? (
          <span className="inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-xs w-7 h-7 ml-1 border border-gray-300">
            +{extraCount}
          </span>
        ) : null;
        return (
          <span className="flex items-center">
            {initials}
            {extra}
          </span>
        );
      },
      enableSorting: false,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" type="button">
                <Edit size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming soon</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => navigate(`/customers/details/${row.original.id}`)}>
                <Info size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Detail</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7" 
                onClick={() => handleDeleteClick(row.original)}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete customer</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      enableSorting: false,
      meta: { headerClassName: "!py-2 !px-2" },
    },
  ];

  const tableToolbar = {
    enableSearch: true,
    searchPlaceholder: "Search by company name...",
    enableFilter: false,
    searchTerm: columnFilters.find((f) => f.id === "companyName")?.value || "",
    setSearchTerm: (val: string) => setColumnFilters([{ id: "companyName", value: val }]),
  };

  return (
    <div className="inventory-container" style={{ width: '100%', padding: '1.5rem 0.5rem' }}>
      <div className="inventory-header" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }} className="text-neutral-800 dark:text-primary-400 font-bold">Customers</h1>
          <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginBottom: 0 }}>
            Manage your business customers and their points of contact.
          </div>
        </div>
        <Button onClick={() => navigate('/customers/add')} className="add-btn" size="sm" style={{ height: 36, fontSize: 14, padding: '0 18px' }}>
          <Plus className="mr-2" size={16} /> Add Customer
        </Button>
      </div>
      {fetchError && (
        <div style={{ color: '#e11d48', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
          {fetchError}
        </div>
      )}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <span className="loader" style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          tableToolbar={tableToolbar}
          fetchData={() => {}}
          totalCount={customers.length}
          loading={false}
          tableId="customers-table"
          className="!text-[13px]"
          headerClassName="!py-2 !px-2"
          tableMainContainerClassName="!rounded-lg"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete customer <span className="font-semibold">{customerToDelete?.name}</span>?
              This will permanently remove the customer and all their associated data.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Customer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList; 