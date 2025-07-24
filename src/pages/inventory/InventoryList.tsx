import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import productsData from "./dummy-products.json";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Info, TrendingDown } from "lucide-react";
import { DataTable } from "@/components/custom/table/data-table";
import { Badge } from "@/components/ui/badge";
import "./InventoryList.css";

interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  history: any[];
}

const getAvailableStock = (product: Product) => product.currentStock - product.reservedStock;

const initialForm: Product = {
  id: "",
  name: "",
  category: "",
  unitPrice: 0,
  costPrice: 0,
  currentStock: 0,
  reservedStock: 0,
  lowStockThreshold: 0,
  history: [],
};

const InventoryList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const localProducts = localStorage.getItem("erp_products");
    if (localProducts) {
      setProducts(JSON.parse(localProducts));
    } else {
      setProducts(productsData as Product[]);
    }
  }, []);

  // Add/Edit Modal logic
  const openAddModal = () => {
    setForm(initialForm);
    setFormErrors({});
    setIsEdit(false);
    setShowAddEditModal(true);
  };
  const openEditModal = (product: Product) => {
    setForm(product);
    setFormErrors({});
    setIsEdit(true);
    setShowAddEditModal(true);
  };
  const closeAddEditModal = () => {
    setShowAddEditModal(false);
  };
  // Details Modal logic
  const openDetailModal = (product: Product) => {
    setDetailProduct(product);
    setShowDetailModal(true);
  };
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailProduct(null);
  };

  // Form validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = "Name required";
    if (!form.category) errs.category = "Category required";
    if (form.unitPrice <= 0) errs.unitPrice = "Unit Price must be positive";
    if (form.costPrice < 0) errs.costPrice = "Cost Price cannot be negative";
    if (form.currentStock < 0) errs.currentStock = "Stock cannot be negative";
    if (form.reservedStock < 0) errs.reservedStock = "Reserved cannot be negative";
    if (form.lowStockThreshold < 0) errs.lowStockThreshold = "Threshold cannot be negative";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name.includes("Price") || name.includes("Stock") || name === "lowStockThreshold" ? Number(value) : value }));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    let updatedProducts: Product[];
    if (isEdit) {
      updatedProducts = products.map((p) => (p.id === form.id ? { ...form } : p));
    } else {
      updatedProducts = [...products, { ...form }];
    }
    setProducts(updatedProducts);
    localStorage.setItem("erp_products", JSON.stringify(updatedProducts));
    setShowAddEditModal(false);
  };

  const isLowStock = (product: Product) => getAvailableStock(product) <= product.lowStockThreshold;

  const columns = [
    {
      id: "name",
      accessorKey: "name",
      header: "Product",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-gray-900 text-[14px]">{row.original.name}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      cell: (({ row }: { row: any }) => <span className="text-[13px]">{row.original.category}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "unitPrice",
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: (({ row }: { row: any }) => <span className="text-[13px]">₹{row.original.unitPrice}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "costPrice",
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: (({ row }: { row: any }) => <span className="text-[13px]">₹{row.original.costPrice}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "currentStock",
      accessorKey: "currentStock",
      header: "Current",
      cell: (({ row }: { row: any }) => <span className="text-[13px]">{row.original.currentStock}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "reservedStock",
      accessorKey: "reservedStock",
      header: "Reserved",
      cell: (({ row }: { row: any }) => <span className="text-[13px]">{row.original.reservedStock}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "availableStock",
      header: "Available",
      cell: (({ row }: { row: any }) => {
        const available = getAvailableStock(row.original);
        return (
          <Badge variant={isLowStock(row.original) ? "destructive" : "default"} className="text-[12px] px-2 py-1">
            {available}
          </Badge>
        );
      }) as any,
      enableSorting: false,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "lowStockThreshold",
      accessorKey: "lowStockThreshold",
      header: "Threshold",
      cell: (({ row }: { row: any }) => (
        <span className="flex items-center gap-1 text-[13px]">
          {row.original.lowStockThreshold}
          {isLowStock(row.original) && <TrendingDown className="text-red-500 w-4 h-4" />}
        </span>
      )) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "actions",
      accessorKey: "actions", // Fix: add accessorKey for display-only column
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditModal(row.original)}>
            <Edit size={16} />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openDetailModal(row.original)}>
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
    searchPlaceholder: "Search by product name...",
    enableFilter: true,
    filterOptions: [
      {
        field: "category",
        title: "Category",
        options: Array.from(new Set(products.map((p) => p.category))).map((cat) => ({ label: cat, value: cat })),
      },
      {
        field: "lowStockThreshold",
        title: "Low Stock Threshold",
        options: [
          { label: "Below Threshold", value: true },
        ],
      },
    ],
    searchTerm: columnFilters.find((f: any) => f.id === "name")?.value || "",
    setSearchTerm: (val: string) => setColumnFilters([{ id: "name", value: val }]),
  };

  return (
    <div className="inventory-container" style={{ padding: '1.5rem 0.5rem' }}>
      <div className="inventory-header" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Inventory Management</h1>
          <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginBottom: 0 }}>
            Track, adjust, and manage your product stock in real time.
          </div>
        </div>
        <Button onClick={openAddModal} className="add-btn" size="sm" style={{ height: 36, fontSize: 14, padding: '0 18px' }}>
          <Plus className="mr-2" size={16} /> Add Product
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        tableToolbar={tableToolbar}
        fetchData={() => {}}
        totalCount={products.length}
        loading={false}
        tableId="inventory-table"
        className="!text-[13px]"
        headerClassName="!py-2 !px-2"
        tableMainContainerClassName="!rounded-lg"
      />

      {/* Add/Edit Product Modal */}
      {showAddEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <form className="product-form" onSubmit={handleFormSubmit}>
              <h2 className="text-xl font-bold mb-2 text-center text-blue-900">{isEdit ? "Edit Product" : "Add Product"}</h2>
              <div className="form-grid flex flex-col gap-4 mb-4">
                <div>
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={handleFormChange} />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>
                <div>
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleFormChange} />
                  {formErrors.category && <span className="error-text">{formErrors.category}</span>}
                </div>
                <div>
                  <label>Unit Price</label>
                  <input name="unitPrice" type="number" value={form.unitPrice} onChange={handleFormChange} />
                  {formErrors.unitPrice && <span className="error-text">{formErrors.unitPrice}</span>}
                </div>
                <div>
                  <label>Cost Price</label>
                  <input name="costPrice" type="number" value={form.costPrice} onChange={handleFormChange} />
                  {formErrors.costPrice && <span className="error-text">{formErrors.costPrice}</span>}
                </div>
                <div>
                  <label>Current Stock</label>
                  <input name="currentStock" type="number" value={form.currentStock} onChange={handleFormChange} />
                  {formErrors.currentStock && <span className="error-text">{formErrors.currentStock}</span>}
                </div>
                <div>
                  <label>Reserved Stock</label>
                  <input name="reservedStock" type="number" value={form.reservedStock} onChange={handleFormChange} />
                  {formErrors.reservedStock && <span className="error-text">{formErrors.reservedStock}</span>}
                </div>
                <div>
                  <label>Available Stock</label>
                  <input name="availableStock" type="number" value={form.currentStock - form.reservedStock} readOnly style={{ background: '#f1f5f9', color: '#64748b' }} />
                </div>
                <div>
                  <label>Low Stock Threshold</label>
                  <input name="lowStockThreshold" type="number" value={form.lowStockThreshold} onChange={handleFormChange} />
                  {formErrors.lowStockThreshold && <span className="error-text">{formErrors.lowStockThreshold}</span>}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button type="button" variant="secondary" onClick={closeAddEditModal}>Cancel</Button>
                <Button type="submit" className="ml-2">{isEdit ? "Edit" : "Add"} Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailModal && detailProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-2 text-center text-blue-900">{detailProduct.name}</h2>
            <div className="mb-2">Product ID: <b>{detailProduct.id}</b></div>
            <div className="mb-2">Category: <b>{detailProduct.category}</b></div>
            <div className="mb-2">Unit Price: <b>₹{detailProduct.unitPrice}</b></div>
            <div className="mb-2">Cost Price: <b>₹{detailProduct.costPrice}</b></div>
            <div className="mb-2">Current Stock: <b>{detailProduct.currentStock}</b></div>
            <div className="mb-2">Reserved Stock: <b>{detailProduct.reservedStock}</b></div>
            <div className="mb-2">Low Stock Threshold: <b>{detailProduct.lowStockThreshold}</b></div>
            <div className="flex justify-end mt-6">
              <Button type="button" variant="secondary" onClick={closeDetailModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList; 