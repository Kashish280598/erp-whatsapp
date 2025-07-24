import React, { useEffect, useState } from "react";
import customersData from "./dummy-customers.json";
import { Button } from "../../components/ui/button";
import { Plus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localCustomers = localStorage.getItem("erp_customers");
    if (localCustomers) {
      setCustomers(JSON.parse(localCustomers));
    } else {
      setCustomers(customersData);
    }
  }, []);

  const columns = [
    {
      id: "companyName",
      accessorKey: "companyName",
      header: ({ column }) => <DataTableColumnHeader column={column} title={<span style={{ fontSize: 14 }}>Company Name</span>} className="!py-2 !px-2" />,
      cell: ({ row }) => (
        <button
          className="font-semibold text-blue-700 text-[14px] hover:text-blue-900 transition-colors focus:outline-none"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          {row.original.companyName}
        </button>
      ),
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
      filterFn: "includesString",
    },
    {
      id: "address",
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnHeader column={column} title={<span style={{ fontSize: 14 }}>Address</span>} className="!py-2 !px-2" />,
      cell: ({ row }) => <span className="text-[13px]">{row.original.address}</span>,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "gst",
      accessorKey: "gst",
      header: ({ column }) => <DataTableColumnHeader column={column} title={<span style={{ fontSize: 14 }}>GST / Business ID</span>} className="!py-2 !px-2" />,
      cell: ({ row }) => <span className="text-[13px]">{row.original.gst}</span>,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "pocs",
      header: ({ column }) => <DataTableColumnHeader column={column} title={<span style={{ fontSize: 14 }}>POCs</span>} className="!py-2 !px-2" />,
      cell: ({ row }) => {
        const pocs = row.original.pocs || [];
        const initials = pocs.slice(0, 2).map((poc, idx) => (
          <span
            key={poc.name}
            className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs w-7 h-7 mr-1 border border-blue-200"
            style={{ zIndex: 10 - idx, marginLeft: idx === 0 ? 0 : -8 }}
          >
            {getInitials(poc.name)}
          </span>
        ));
        const extra = pocs.length > 2 ? (
          <span className="inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-xs w-7 h-7 ml-1 border border-gray-300">
            +{pocs.length - 2}
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
      header: <span style={{ fontSize: 13 }}>Actions</span>,
      cell: ({ row }) => (
        <div className="flex gap-1">
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
    searchTerm: columnFilters.find(f => f.id === "companyName")?.value || "",
    setSearchTerm: (val) => setColumnFilters([{ id: "companyName", value: val }]),
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
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default CustomersList; 