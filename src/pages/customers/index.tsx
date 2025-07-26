import { Routes, Route, useParams } from "react-router-dom";
import CustomersList from "./CustomersList";
import customersData from "./dummy-customers.json";
import AddCustomer from "./add-customer";
import CustomerDetails from "./customer-details";

function AddCustomerForm() {
  return <div>Add Customer (coming soon)</div>;
}

function CustomersCompanyDetail() {
  const { companyName } = useParams();
  const decodedName = decodeURIComponent(companyName || "");
  // Find all customers with this company name
  const allCustomers = Array.isArray(customersData) ? customersData : [];
  const companyCustomers = allCustomers.filter(c => c.companyName === decodedName);
  const allPOCs = companyCustomers.flatMap(c => c.pocs.map(poc => ({ ...poc, customerId: c.id })));

  return (
    <div style={{ margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{decodedName}</h2>
      <div style={{ color: '#64748b', fontWeight: 500, marginBottom: 18 }}>
        All Points of Contact (POCs) for this company:
      </div>
      {allPOCs.length === 0 ? (
        <div style={{ color: '#e11d48', fontWeight: 500 }}>No POCs found for this company.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {allPOCs.map((poc, idx) => (
            <div key={poc.customerId + poc.phone + idx} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <span style={{ background: '#e0e7ff', color: '#3730a3', fontWeight: 700, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 16 }}>
                {poc.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{poc.name}</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>{poc.phone}</div>
                {poc.designation && <div style={{ color: '#64748b', fontSize: 13 }}>Designation: {poc.designation}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Routes>
      <Route path="" element={<CustomersList />} />
      <Route path="add" element={<AddCustomer />} />
      <Route path="edit/:id" element={<AddCustomer mode="edit" />} />
      <Route path="details/:id" element={<CustomerDetails />} />
      <Route path="company/:companyName" element={<CustomersCompanyDetail />} />
    </Routes>
  );
} 