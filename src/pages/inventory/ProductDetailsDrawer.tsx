import React from "react";
import { Drawer, DrawerContent } from "../../components/ui/drawer";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const ProductDetailsDrawer = ({ open, product, onClose }) => {
  if (!product) return null;
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <div className="product-details-drawer">
          <h2>{product.name} <Badge>{product.category}</Badge></h2>
          <Separator className="mb-2" />
          <div className="details-grid">
            <div><strong>Product ID:</strong> {product.id}</div>
            <div><strong>Unit Price:</strong> ₹{product.unitPrice}</div>
            <div><strong>Cost Price:</strong> ₹{product.costPrice}</div>
            <div><strong>Current Stock:</strong> {product.currentStock}</div>
            <div><strong>Reserved Stock:</strong> {product.reservedStock}</div>
            <div><strong>Available:</strong> {product.currentStock - product.reservedStock}</div>
            <div><strong>Low Stock Threshold:</strong> {product.lowStockThreshold}</div>
          </div>
          <Separator className="my-4" />
          <h3>Stock History</h3>
          <Card className="history-table-card">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Cost</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {product.history?.map((h, idx) => (
                  <tr key={idx}>
                    <td>{h.date}</td>
                    <td>{h.type}</td>
                    <td>{h.qty}</td>
                    <td>{h.cost ? `₹${h.cost}` : "-"}</td>
                    <td>{h.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Separator className="my-4" />
          <h3>Stock Trend (Last 10 Movements)</h3>
          <div className="trend-chart-placeholder">
            {/* Replace with real chart later */}
            <div className="trend-chart-bg">[Line Chart Placeholder]</div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetailsDrawer; 