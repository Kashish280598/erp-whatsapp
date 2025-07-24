import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";

const StockAdjustModal = ({ product, onClose, onAdjust }) => {
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState("");
  const [type, setType] = useState("damage");
  const [error, setError] = useState("");

  const handleAdjust = (e) => {
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
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            onChange={(e) => setReason(e.target.value)}
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