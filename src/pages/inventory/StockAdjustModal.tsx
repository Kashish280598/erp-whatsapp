import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";

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

interface StockAdjustModalProps {
  product: Product;
  onClose: () => void;
  onAdjust: (product: Product) => void;
}

const StockAdjustModal = ({ product, onClose, onAdjust }: StockAdjustModalProps) => {
  const [qty, setQty] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [type, setType] = useState<string>("damage");
  const [error, setError] = useState<string>("");

  const handleAdjust = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!qty || qty <= 0) {
      setError("Enter a valid quantity");
      return;
    }
    if (!reason) {
      setError("Reason required");
      return;
    }
    let newStock = product.currentStock;
    if (type === "damage" || type === "expiry") {
      newStock -= qty;
    } else {
      newStock += qty;
    }
    if (newStock < 0) {
      setError("Stock cannot be negative");
      return;
    }
    const newHistory = [
      ...product.history,
      {
        date: new Date().toISOString().slice(0, 10),
        type: "adjustment",
        qty: type === "damage" || type === "expiry" ? -qty : qty,
        reason,
      },
    ];
    onAdjust({ ...product, currentStock: newStock, history: newHistory });
  };

  return (
    <form className="stock-adjust-form" onSubmit={handleAdjust}>
      <h2>Adjust Stock for {product?.name}</h2>
      <Separator className="mb-4" />
      <div className="form-grid">
        <div>
          <Label htmlFor="qty">Quantity</Label>
          <Input
            name="qty"
            type="number"
            value={qty}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQty(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            name="type"
            value={type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
            className="shadcn-select"
          >
            <option value="damage">Damage</option>
            <option value="expiry">Expiry</option>
            <option value="manual-in">Manual Inward</option>
          </select>
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Input
            name="reason"
            value={reason}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
          />
        </div>
      </div>
      {error && <span className="error-text">{error}</span>}
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="ml-2">
          Adjust
        </Button>
      </div>
    </form>
  );
};

export default StockAdjustModal; 