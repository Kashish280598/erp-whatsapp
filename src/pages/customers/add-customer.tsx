import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';
import customersData from './dummy-customers.json';

interface POC {
  name: string;
  role?: string;
  email: string;
  phone: string;
  designation?: string;
}

const defaultPOC: POC = { name: '', role: '', email: '', phone: '', designation: '' };

export default function AddCustomer({ mode = 'add' }: { mode?: 'add' | 'edit' }) {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [pocs, setPocs] = useState<POC[]>([{ ...defaultPOC }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (mode === 'edit' && id) {
      // Try to get from localStorage first
      let customers: any[] = [];
      const localCustomers = localStorage.getItem('erp_customers');
      if (localCustomers) {
        customers = JSON.parse(localCustomers);
      } else {
        customers = customersData as any[];
      }
      const customer = customers.find(c => c.id === id);
      if (customer) {
        setName(customer.companyName || '');
        setAddress(customer.address || '');
        setGstNo(customer.gst || '');
        setPocs(customer.pocs || [{ ...defaultPOC }]);
      }
    }
  }, [mode, id]);

  const handlePOCChange = (idx: number, field: keyof POC, value: string) => {
    setPocs(pocs => pocs.map((poc, i) => i === idx ? { ...poc, [field]: value } : poc));
  };

  const addPOC = () => setPocs([...pocs, { ...defaultPOC }]);
  const removePOC = (idx: number) => setPocs(pocs => pocs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Prepare users array for API
      const users = pocs.map((poc) => ({
        name: poc.name,
        email: poc.email,
        mobileNo: poc.phone,
        designation: poc.designation,
      }));
      // Prepare payload
      const payload = {
        name,
        gstNo,
        address,
        users,
      };
      // POST to /api/customers
      const res = await fetch(API_CONFIG.baseURL + API_ENDPOINTS.customers.all, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MzQyODAyNCwiZXhwIjoxNzU0MDMyODI0fQ.UEVhtXDNxoffAT9lqfgPoJNvujfzYcc_UP1qoOZGwsM',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add customer');
      setError(null);
      navigate(-1); // Go back to customer list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
      <div style={{ width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 6px 32px rgba(30,41,59,0.10)', padding: 36, margin: '0 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18, color: '#1e293b', letterSpacing: 0.2, textAlign: 'center' }}>Add Customer / Organization</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, color: '#334155', fontSize: 15, marginBottom: 4, display: 'block' }}>Company/Organization Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 12, border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 15, background: '#f9fafb', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #cbd5e1'} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, color: '#334155', fontSize: 15, marginBottom: 4, display: 'block' }}>Company Address *</label>
            <input required value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: 12, border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 15, background: '#f9fafb', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #cbd5e1'} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontWeight: 600, color: '#334155', fontSize: 15, marginBottom: 4, display: 'block' }}>Business ID (GST No) (optional)</label>
            <input value={gstNo} onChange={e => setGstNo(e.target.value)} style={{ width: '100%', padding: 12, border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 15, background: '#f9fafb', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.5px solid #2563eb'} onBlur={e => e.target.style.border = '1.5px solid #cbd5e1'} />
          </div>
          <div style={{ marginBottom: 32 }}>
           <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'left', 
              gap: '20px', 
              paddingBottom: 6, 
              marginBottom: 12 
            }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: 16, 
                color: '#1e293b', 
                letterSpacing: 0.2 
              }}>
                Points of Contact (POCs)
              </div>
              <button 
                type="button" 
                onClick={addPOC} 
                style={{ 
                  marginTop: 0, 
                  background: '#2563eb', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '10px 20px', 
                  fontWeight: 700, 
                  fontSize: 15, 
                  cursor: 'pointer', 
                  boxShadow: '0 1px 4px rgba(37,99,235,0.10)' 
                }}
              >
                + Add POC
              </button>
            </div>

            {pocs.map((poc, idx) => (
              <div key={idx} style={{ background: '#f3f4f6', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 4px rgba(30,41,59,0.04)', width: '100%', position: 'relative' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 160 }}>
                    <label style={{ fontWeight: 500, color: '#334155', fontSize: 14, marginBottom: 2, display: 'block' }}>Name *</label>
                    <input required placeholder="Name" value={poc.name} onChange={e => handlePOCChange(idx, 'name', e.target.value)} style={{ width: '100%', padding: 10, border: '1.2px solid #cbd5e1', borderRadius: 6, fontSize: 14, background: '#fff', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.2px solid #2563eb'} onBlur={e => e.target.style.border = '1.2px solid #cbd5e1'} />
                  </div>
                  <div style={{ flex: 2, minWidth: 160 }}>
                    <label style={{ fontWeight: 500, color: '#334155', fontSize: 14, marginBottom: 2, display: 'block' }}>Email *</label>
                    <input required type="email" placeholder="Email" value={poc.email} onChange={e => handlePOCChange(idx, 'email', e.target.value)} style={{ width: '100%', padding: 10, border: '1.2px solid #cbd5e1', borderRadius: 6, fontSize: 14, background: '#fff', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.2px solid #2563eb'} onBlur={e => e.target.style.border = '1.2px solid #cbd5e1'} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 160 }}>
                    <label style={{ fontWeight: 500, color: '#334155', fontSize: 14, marginBottom: 2, display: 'block' }}>WhatsApp Phone *</label>
                    <input required placeholder="WhatsApp Phone" value={poc.phone} onChange={e => handlePOCChange(idx, 'phone', e.target.value)} style={{ width: '100%', padding: 10, border: '1.2px solid #cbd5e1', borderRadius: 6, fontSize: 14, background: '#fff', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.2px solid #2563eb'} onBlur={e => e.target.style.border = '1.2px solid #cbd5e1'} />
                  </div>
                  <div style={{ flex: 2, minWidth: 120 }}>
                    <label style={{ fontWeight: 500, color: '#334155', fontSize: 14, marginBottom: 2, display: 'block' }}>Designation (optional)</label>
                    <input placeholder="Designation (optional)" value={poc.designation} onChange={e => handlePOCChange(idx, 'designation', e.target.value)} style={{ width: '100%', padding: 10, border: '1.2px solid #cbd5e1', borderRadius: 6, fontSize: 14, background: '#fff', transition: 'border 0.2s', outline: 'none' }} onFocus={e => e.target.style.border = '1.2px solid #2563eb'} onBlur={e => e.target.style.border = '1.2px solid #cbd5e1'} />
                  </div>
                  {pocs.length > 1 && (
                    <button type="button" onClick={() => removePOC(idx)} style={{ background: '#e11d48', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginLeft: 8, marginTop: 18, cursor: 'pointer', fontSize: 14, boxShadow: '0 1px 4px rgba(225,29,72,0.10)'}}>Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {error && <div style={{ color: '#e11d48', marginBottom: 18, fontWeight: 600, textAlign: 'center' }}>{error}</div>}
          <div style={{width: "100%" , justifyContent: "center" , alignItems: "center" , display:"flex"}}>
            <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', padding: '14px 40px', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.10)', width: "auto", marginTop: 8 }}>
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
} 