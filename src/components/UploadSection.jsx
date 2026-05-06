import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, AlertCircle, FileCheck, CheckCircle } from 'lucide-react';

const UploadSection = ({ onUpload }) => {
  const [status, setStatus] = useState({ state: 'idle', message: '', loaded: 0, skipped: 0 });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus({ state: 'processing', message: 'Analyzing data...', loaded: 0, skipped: 0 });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta } = results;
        const required = ['item', 'current_price', 'cost', 'monthly_volume', 'cost_increase_pct'];
        const headers = meta.fields ? meta.fields.map(f => f.toLowerCase().trim().replace(/ /g, '_').replace(/%/g, 'pct')) : [];
        const missing = required.filter(r => !headers.includes(r));

        if (missing.length > 0) {
          setStatus({ state: 'error', message: `Missing required columns: ${missing.join(', ')}` });
          return;
        }

        const normalized = data.map(row => {
          const normRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.toLowerCase().trim().replace(/ /g, '_').replace(/%/g, 'pct');
            normRow[cleanKey] = row[key];
          });
          return normRow;
        });

        const validated = normalized.filter((row, idx) => {
          const sanitize = (v) => String(v || '').replace(/[^0-9.-]/g, '');
          const price = parseFloat(sanitize(row.current_price)) || 0;
          const vol = parseFloat(sanitize(row.monthly_volume)) || 0;
          return row.item && row.item.trim() !== '' && price > 0 && vol > 0;
        });

        if (validated.length === 0) {
          setStatus({ state: 'error', message: "No valid data found in CSV. Check headers and values." });
          return;
        }

        setStatus({ 
          state: 'success', 
          message: `Successfully loaded ${validated.length} items.`, 
          loaded: validated.length,
          skipped: normalized.length - validated.length
        });

        setTimeout(() => onUpload(validated), 1000);
      },
      error: (err) => {
        setStatus({ state: 'error', message: `CSV Parser Error: ${err.message}` });
      }
    });
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '700px', margin: '4rem auto' }}>
      <div 
        className="dropzone"
        onClick={() => document.getElementById('csv-input').click()}
        style={{ borderColor: status.state === 'error' ? 'var(--accent-danger)' : 'var(--card-border)', padding: '2rem' }}
      >
        <input 
          id="csv-input"
          type="file" 
          accept=".csv,.xlsx,.xls" 
          style={{ display: 'none' }} 
          onChange={handleFileUpload}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: status.state === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '1rem' 
          }}>
            {status.state === 'success' ? <CheckCircle size={40} color="var(--accent-success)" /> : 
             status.state === 'error' ? <AlertCircle size={40} color="var(--accent-danger)" /> :
             <Upload size={40} color="var(--accent-primary)" />}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#ffffff' }}>
              Supported formats: .csv, .xlsx, .xls
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              (Export Google Sheets as .csv or .xlsx before uploading)
            </p>
          </div>

          {status.message && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: status.state === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '0.5rem',
              color: status.state === 'error' ? 'var(--accent-danger)' : 'var(--accent-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}>
              {status.state === 'error' ? <AlertCircle size={16} /> : <FileCheck size={16} />}
              {status.message}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '2.5rem', padding: '0 1rem' }}>
        <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
          Sample Data Format
        </h4>
        <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid var(--card-border)' }}>
          <table style={{ minWidth: '100%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>Item</th>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>Current Price</th>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>Cost</th>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>Monthly Volume</th>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>Cost Increase %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem' }}>Nasi Lemak</td>
                <td style={{ padding: '0.5rem' }}>8.50</td>
                <td style={{ padding: '0.5rem' }}>3.20</td>
                <td style={{ padding: '0.5rem' }}>450</td>
                <td style={{ padding: '0.5rem' }}>15</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem' }}>Teh Tarik</td>
                <td style={{ padding: '0.5rem' }}>4.00</td>
                <td style={{ padding: '0.5rem' }}>1.10</td>
                <td style={{ padding: '0.5rem' }}>1200</td>
                <td style={{ padding: '0.5rem' }}>12</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          * ensure headers match the names shown above exactly.
        </p>
      </div>
    </div>
  );
};

export default UploadSection;
