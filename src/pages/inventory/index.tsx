import { Routes, Route } from "react-router-dom";
import InventoryList from "./InventoryList";
import ProductForm from "./ProductForm";

export default function InventoryPage() {
  return (
    <Routes>
      <Route path="" element={<InventoryList />} />
      <Route path="add" element={<ProductForm />} />
      {/* Placeholders for edit and details */}
      <Route path="edit/:id" element={<div>Edit Product (coming soon)</div>} />
      <Route path="details/:id" element={<div>Product Details (coming soon)</div>} />
    </Routes>
  );
} 