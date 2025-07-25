import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Info, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
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

  useEffect(() => {
    // Fetch customers from API
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.customers.all, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch customers');
        const apiData = await res.json();
        console.log('Fetched customers API response:', apiData);
        if (!apiData.data || !Array.isArray(apiData.data.customers)) {
          setFetchError('No customers found or API response format changed.');
          setCustomers([]);
        } else {
          setCustomers(apiData.data.customers);
          setFetchError(null);
        }
      } catch (err: any) {
        setFetchError(err.message || 'Failed to fetch customers');
        setCustomers([]);
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

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
      cell: ({ row }: { row: any }) => <span className="text-[13px]">{row.original.address}</span>,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "gst",
      accessorKey: "gst",
      header: "GST / Business ID",
      cell: ({ row }: { row: any }) => <span className="text-[13px]">{row.original.gstNo}</span>,
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
      accessorKey: "actions", // Fix: add accessorKey for display-only column
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => navigate(`/customers/edit/${row.original.id}`)}>
            <Edit size={16} />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => navigate(`/customers/company/${encodeURIComponent(row.original.companyName)}`)}>
            <Info size={16} />
          </Button>
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
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Customers</h1>
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
    </div>
  );
};

export default CustomersList; 