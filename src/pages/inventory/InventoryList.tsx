import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Plus, TrendingDown } from "lucide-react";
import { DataTable } from "@/components/custom/table/data-table";
import { Badge } from "@/components/ui/badge";
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';
import "./InventoryList.css";
import { Formik, Field } from "formik";
import { Input } from "@/components/ui/input";

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

interface Category {
  id: number;
  name: string;
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableQnt, setAvailableQnt] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [newProductId, setNewProductId] = useState<number | null>(null);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.categories + '?page=1&limit=10');
        
        if (!res.ok) throw new Error('Failed to fetch categories');
        const apiData = await res.json();
        setCategories(apiData.data?.categories || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Refetch products function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let allProducts: any[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      // Fetch all pages
      while (hasMorePages) {
        const url = `${API_CONFIG.baseURL + API_ENDPOINTS.products}?page=${currentPage}&limit=10`;
        
        const headers = {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
        };
        
        const res = await fetch(url, {
          headers,
        });
        
        if (!res.ok) throw new Error('Failed to fetch products');
        const apiData = await res.json();
        
        if (!apiData.data || !Array.isArray(apiData.data.products)) {
          throw new Error('Invalid API response format');
        }
        
        // Add products from this page
        allProducts = [...allProducts, ...apiData.data.products];
        
        // Check if there are more pages
        const totalCount = apiData.data.totalCount || apiData.data.count || 0;
        const currentPageCount = apiData.data.products.length;
        
        if (allProducts.length >= totalCount || currentPageCount === 0) {
          hasMorePages = false;
        } else {
          currentPage++;
        }
      }
      
      // Map API data to table data structure
      const mappedProducts = allProducts.map((p: any) => {
        // Calculate currentStock as sum of all availableQnt in Stocks
        const currentStock = Array.isArray(p.Stocks)
          ? p.Stocks.reduce((sum: number, s: any) => sum + (s.availableQnt || 0), 0)
          : 0;
        // Calculate reservedStock as sum of all reservedQnt in Stocks
        const reservedStock = Array.isArray(p.Stocks)
          ? p.Stocks.reduce((sum: number, s: any) => sum + (s.reservedQnt || 0), 0)
          : 0;
        return {
          id: p.id,
          name: p.name,
          category: p.Category?.name || '',
          unitPrice: p.unitPrice,
          costPrice: p.costPrice,
          currentStock,
          reservedStock,
          lowStockThreshold: p.lowStockThreshold,
          history: [],
          // Optionally, keep original for details
          _original: p,
        };
      });
      
      setProducts(mappedProducts);
      setFetchError(null);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch products');
      setProducts([]);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add/Edit Modal logic
  const openAddModal = () => {
    setForm(initialForm);
    setFormErrors({});
    setIsEdit(false);
    setShowAddEditModal(true);
    setAddStep(1);
    setNewProductId(null);
    setAvailableQnt(0);
    setBuyPrice(0);
  };
  
  const closeAddEditModal = () => {
    setShowAddEditModal(false);
    setAddStep(1);
    setNewProductId(null);
    setAvailableQnt(0);
    setBuyPrice(0);
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

  // Step 1: Add Product handler (Formik version)
  const handleAddProductStep = async (values: any, { setSubmitting }: any) => {
    // Validate only the 3 required fields
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = 'Name required';
    if (!values.unitPrice) errors.unitPrice = 'Unit Price required';
    if (!values.costPrice) errors.costPrice = 'Cost Price required';
    if (!values.lowStockThreshold) errors.lowStockThreshold = 'Low Stock Threshold required';
    if (!values.category) errors.category = 'Category required';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitting(false);
      return;
    }
    try {
      const productPayload = {
        name: values.name,
        unitPrice: values.unitPrice,
        costPrice: values.costPrice,
        lowStockThreshold: values.lowStockThreshold,
        categoryId: Number(values.category),
      };
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
      };
      const productRes = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.products, {
        method: 'POST',
        headers,
        body: JSON.stringify(productPayload),
      });
      if (!productRes.ok) throw new Error('Failed to add product');
      const productData = await productRes.json();
      const productId = productData.data?.product?.id || productData.data?.id;
      if (!productId) throw new Error('Product ID not returned');
      setNewProductId(Number(productId));
      setAddStep(2);
    } catch (err: any) {
      setFormErrors({ name: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Add Stock handler
  const handleAddStockStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!availableQnt && availableQnt !== 0) errors.availableQnt = 'Available Quantity required';
    if (!buyPrice && buyPrice !== 0) errors.buyPrice = 'Buy Price required';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const stockPayload = {
        ProductId: newProductId,
        availableQnt,
        buyPrice,
      };
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
      };
      const stockRes = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.stocks, {
        method: 'POST',
        headers,
        body: JSON.stringify(stockPayload),
      });
      if (!stockRes.ok) throw new Error('Failed to add stock');
      setShowAddEditModal(false);
      setSuccessMessage('Product and stock added successfully!');
      fetchProducts();
      setForm(initialForm);
      setAvailableQnt(0);
      setBuyPrice(0);
      setAddStep(1);
      setNewProductId(null);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      setFormErrors({ availableQnt: err.message });
    }
  };

  const isLowStock = (product: Product) => getAvailableStock(product) <= product.lowStockThreshold;

  const columns = [
    {
      id: "name",
      accessorKey: "name",
      header: "Product",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-neutral-700 dark:text-neutral-50 text-[14px]">{row.original.name}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-neutral-700 dark:text-neutral-50 text-[13px]">{row.original.category}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "unitPrice",
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-neutral-700 dark:text-neutral-50 text-[13px]">₹{row.original.unitPrice}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "costPrice",
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-neutral-700 dark:text-neutral-50 text-[13px]">₹{row.original.costPrice}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "currentStock",
      accessorKey: "currentStock",
      header: "Current Quantity",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-neutral-700 dark:text-neutral-50 text-[13px]">{row.original.currentStock}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "reservedStock",
      accessorKey: "reservedStock",
      header: "Reserved Quantity",
      cell: (({ row }: { row: any }) => <span className="font-semibold text-neutral-700 dark:text-neutral-50 text-[13px]">{row.original.reservedStock}</span>) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    {
      id: "availableStock",
      header: "Available",
      cell: (({ row }: { row: any }) => {
        // Available = currentStock - reservedStock
        const available = row.original.currentStock - row.original.reservedStock;
        const isLow = isLowStock(row.original);
        return (
          <Badge
            className={
              isLow
                ? "bg-error-600 text-white dark:bg-error-600 dark:text-white text-[12px] px-2 py-1"
                : "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 text-[12px] px-2 py-1"
            }
          >
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
        <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-50 text-[13px]">
          {row.original.lowStockThreshold}
          {isLowStock(row.original) && <TrendingDown className="text-red-500 w-4 h-4" />}
        </span>
      )) as any,
      enableSorting: true,
      meta: { headerClassName: "!py-2 !px-2" },
    },
    // {
    //   id: "actions",
    //   accessorKey: "actions", // Fix: add accessorKey for display-only column
    //   header: "Actions",
    //         cell: () => (
    //     <div className="flex gap-1">
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button size="icon" variant="ghost" className="h-7 w-7" type="button">
    //             <Edit size={16} />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           <p>Coming soon</p>
    //         </TooltipContent>
    //       </Tooltip>
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button size="icon" variant="ghost" className="h-7 w-7" type="button">
    //             <Info size={16} />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           <p>Coming soon</p>
    //         </TooltipContent>
    //       </Tooltip>
    //     </div>
    //   ),
    //   enableSorting: false,
    //   meta: { headerClassName: "!py-2 !px-2" },
    // },
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

  // Add a derived filteredProducts array based on columnFilters
  const filteredProducts = React.useMemo(() => {
    let result = products;
    // Filter by threshold if filter is set
    const thresholdFilter = columnFilters.find((f: any) => f.id === 'lowStockThreshold');
    if (thresholdFilter && thresholdFilter.value === true) {
      result = result.filter((p) => isLowStock(p));
    }
    // You can add more filters here if needed
    return result;
  }, [products, columnFilters]);

  return (
    <div className="inventory-container" style={{ width: '100%', padding: '1.5rem 0.5rem' }}>
      <div className="inventory-header" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }} className="text-neutral-800 dark:text-primary-400 font-bold">Inventory</h1>
          <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginBottom: 0 }}>
            Manage your products and stock levels.
          </div>
        </div>
        <Button onClick={openAddModal} className="add-btn" size="sm" style={{ height: 36, fontSize: 14, padding: '0 18px' }}>
          <Plus className="mr-2" size={16} /> Add Product
        </Button>
      </div>
      {fetchError && (
        <div style={{ color: '#e11d48', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
          {fetchError}
        </div>
      )}
      {successMessage && (
        <div style={{ color: '#16a34a', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>{successMessage}</div>
      )}
      <DataTable
        columns={columns}
        data={filteredProducts}
        tableToolbar={tableToolbar}
        fetchData={() => {}}
        totalCount={products.length}
        loading={loading}
        tableId="inventory-table"
        className="!text-[13px]"
        headerClassName="!py-2 !px-2"
        tableMainContainerClassName="!rounded-lg"
      />

      {/* Add/Edit Product Modal */}
      {showAddEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content z-50" style={{ maxWidth: 800, width: '100%', padding: 32, borderRadius: 16, boxShadow: '0 6px 32px rgba(30,41,59,0.10)', zIndex: 9999 }}>
            {addStep === 1 && (
              <Formik
                initialValues={{ name: '', unitPrice: '', category: '', lowStockThreshold: '' , costPrice: ''}}
                onSubmit={(values, actions) => handleAddProductStep(values, actions)}
              >
                {({ errors, touched, isSubmitting, handleSubmit, values, setFieldValue }) => {
                  const [categories, setCategories] = React.useState<any[]>([]);
                  const [catLoading, setCatLoading] = React.useState(false);
                  const [catError, setCatError] = React.useState<string | null>(null);
                  React.useEffect(() => {
                    const fetchCategories = async () => {
                      setCatLoading(true);
                      setCatError(null);
                      try {
                        const res = await fetch(
                          `${API_CONFIG.baseURL + API_ENDPOINTS.categories}?page=1&limit=50`,
                          {
                            headers: {
                              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                            },
                          }
                        );
                        if (!res.ok) throw new Error('Failed to fetch categories');
                        const data = await res.json();
                        setCategories(Array.isArray(data?.data?.categories) ? data.data.categories : []);
                      } catch (err: any) {
                        setCatError(err.message || 'Failed to fetch categories');
                        setCategories([]);
                      } finally {
                        setCatLoading(false);
                      }
                    };
                    fetchCategories();
                  }, []);
                  return (
                    <form className="grid grid-cols-1 gap-4 w-full" onSubmit={handleSubmit}>
                      <h2 className="text-2xl font-bold mb-2 text-center text-blue-900" style={{ marginBottom: 24 }}>Add Product</h2>
                      <div className="w-full">
                        <Field name="name">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="name"
                              type="text"
                              label="Product Name"
                              placeholder="Enter product name"
                              error={touched.name && errors.name}
                              className="w-full"
                            />
                          )}
                        </Field>
                      </div>
                      <div className="w-full">
                        <Field name="unitPrice">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="unitPrice"
                              type="number"
                              label="Unit Price"
                              placeholder="Enter unit price"
                              error={touched.unitPrice && errors.unitPrice}
                              className="w-full"
                            />
                          )}
                        </Field>
                      </div>
                      <div className="w-full">
                        <Field name="costPrice">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="costPrice"
                              type="number"
                              label="cost Price"
                              placeholder="Enter cost price"
                              error={touched.costPrice && errors.costPrice}
                              className="w-full"
                            />
                          )}
                        </Field>
                      </div>
                      <div className="w-full">
                        <label htmlFor="category" className="block text-[13px] font-[600] text-neutral-500 leading-5 mb-2">Category</label>
                        <select
                          id="category"
                          name="category"
                          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-[13px] font-[400] bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          value={values.category}
                          onChange={e => setFieldValue('category', e.target.value)}
                          disabled={catLoading}
                        >
                          <option value="">{catLoading ? 'Loading...' : 'Select category'}</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        {touched.category && errors.category && (
                          <div className="text-red-500 text-xs mt-1">{errors.category}</div>
                        )}
                        {catError && <div className="text-red-500 text-xs mt-1">{catError}</div>}
                      </div>
                      <div className="w-full">
                        <Field name="lowStockThreshold">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="lowStockThreshold"
                              type="number"
                              label="Low Stock Threshold"
                              placeholder="Enter low stock threshold"
                              error={touched.lowStockThreshold && errors.lowStockThreshold}
                              className="w-full"
                            />
                          )}
                        </Field>
                      </div>
                      <div className="flex justify-center gap-4">
                        <Button
                          type="button"
                          onClick={closeAddEditModal}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Add Product'}
                        </Button>
                      </div>
                    </form>
                  );
                }}
              </Formik>
            )}
            {addStep === 2 && (
              <Formik
                initialValues={{ availableQnt: '', buyPrice: '' }}
                validate={values => {
                  const errors: Record<string, string> = {};
                  if (values.availableQnt === '' || isNaN(Number(values.availableQnt))) {
                    errors.availableQnt = 'Available Quantity required';
                  } else if (Number(values.availableQnt) < 0) {
                    errors.availableQnt = 'Available Quantity cannot be negative';
                  }
                  if (values.buyPrice === '' || isNaN(Number(values.buyPrice))) {
                    errors.buyPrice = 'Buy Price required';
                  } else if (Number(values.buyPrice) < 0) {
                    errors.buyPrice = 'Buy Price cannot be negative';
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setFormErrors({});
                  try {
                    const stockPayload = {
                      ProductId: newProductId,
                      availableQnt: Number(values.availableQnt),
                      buyPrice: Number(values.buyPrice),
                    };
                    const headers = {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
                    };
                    const stockRes = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.stocks, {
                      method: 'POST',
                      headers,
                      body: JSON.stringify(stockPayload),
                    });
                    if (!stockRes.ok) throw new Error('Failed to add stock');
                    setShowAddEditModal(false);
                    setSuccessMessage('Product and stock added successfully!');
                    fetchProducts();
                    setForm(initialForm);
                    setAvailableQnt(0);
                    setBuyPrice(0);
                    setAddStep(1);
                    setNewProductId(null);
                    setTimeout(() => setSuccessMessage(null), 2500);
                  } catch (err: any) {
                    setFormErrors({ availableQnt: err.message });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ errors, touched, isSubmitting, handleSubmit }) => (
                  <form className="grid grid-cols-1 gap-4 w-full" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-2 text-center text-blue-900" style={{ marginBottom: 24 }}>Add Stocks</h2>
                    <div className="w-full">
                      <Input
                        id="ProductId"
                        label="Product ID"
                        value={newProductId ?? ''}
                        readOnly
                        className="w-full bg-gray-100"
                      />
                    </div>
                    <div className="w-full">
                      <Field name="availableQnt">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="availableQnt"
                            type="number"
                            label="Available Quantity"
                            placeholder="Enter available quantity"
                            error={touched.availableQnt && errors.availableQnt}
                            className="w-full"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="w-full">
                      <Field name="buyPrice">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="buyPrice"
                            type="number"
                            label="Buy Price"
                            placeholder="Enter buy price"
                            error={touched.buyPrice && errors.buyPrice}
                            className="w-full"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        type="button"
                        onClick={closeAddEditModal}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Add Stock'}
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>
            )}
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