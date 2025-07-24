import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  history: any[];
}

const initialState: Product = {
  name: "",
  category: "",
  unitPrice: 0,
  costPrice: 0,
  currentStock: 0,
  reservedStock: 0,
  lowStockThreshold: 0,
  history: [],
};

const ProductForm = () => {
  const [form, setForm] = useState<Product>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = "Name required";
    if (!form.category) errs.category = "Category required";
    if (form.unitPrice <= 0) errs.unitPrice = "Unit Price must be positive";
    if (form.costPrice < 0) errs.costPrice = "Cost Price cannot be negative";
    if (form.currentStock < 0) errs.currentStock = "Stock cannot be negative";
    if (form.reservedStock < 0) errs.reservedStock = "Reserved cannot be negative";
    if (form.lowStockThreshold < 0) errs.lowStockThreshold = "Threshold cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name.includes("Price") || name.includes("Stock") || name === "lowStockThreshold" ? Number(value) : value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    // Save to localStorage (simulate backend)
    const products = JSON.parse(localStorage.getItem("erp_products") || "[]");
    products.push(form);
    localStorage.setItem("erp_products", JSON.stringify(products));
    navigate("/inventory");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-white to-blue-50 py-8 px-2">
      <form className="product-form max-w-xl w-full bg-white shadow-xl rounded-2xl p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-900">Add New Product</h2>
        <p className="text-gray-500 text-center mb-6">Fill in the details to add a new product to your inventory.</p>
        <Separator className="mb-4" />
        <div className="form-grid flex flex-col gap-4 mb-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
          <div>
            <Label htmlFor="unitPrice">Unit Price</Label>
            <Input name="unitPrice" type="number" value={form.unitPrice} onChange={handleChange} placeholder="Unit Price" />
            {errors.unitPrice && <span className="error-text">{errors.unitPrice}</span>}
          </div>
          <div>
            <Label htmlFor="costPrice">Cost Price</Label>
            <Input name="costPrice" type="number" value={form.costPrice} onChange={handleChange} placeholder="Cost Price" />
            {errors.costPrice && <span className="error-text">{errors.costPrice}</span>}
          </div>
          <div>
            <Label htmlFor="currentStock">Current Stock</Label>
            <Input name="currentStock" type="number" value={form.currentStock} onChange={handleChange} placeholder="Current Stock" />
            {errors.currentStock && <span className="error-text">{errors.currentStock}</span>}
          </div>
          <div>
            <Label htmlFor="reservedStock">Reserved Stock</Label>
            <Input name="reservedStock" type="number" value={form.reservedStock} onChange={handleChange} placeholder="Reserved Stock" />
            {errors.reservedStock && <span className="error-text">{errors.reservedStock}</span>}
          </div>
          <div>
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input name="lowStockThreshold" type="number" value={form.lowStockThreshold} onChange={handleChange} placeholder="Low Stock Threshold" />
            {errors.lowStockThreshold && <span className="error-text">{errors.lowStockThreshold}</span>}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate("/inventory")}>Cancel</Button>
          <Button type="submit" className="ml-2">Add Product</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 