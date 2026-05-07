import React, { useState, useMemo } from 'react';
import { calculateMetrics, aggregateMetrics } from '../utils/metrics';
import MetricsOverview from './MetricsOverview';
import ItemTable from './ItemTable';
import Visuals from './Visuals';
import UploadSection from './UploadSection';
import ActionPanel from './ActionPanel';
import { ShieldAlert, TrendingUp, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Dashboard() {
  const [rawData, setRawData] = useState([]);
  const [sensitivity, setSensitivity] = useState(0); // 0% adjustment by default
  const navigate = useNavigate();

  const processedData = useMemo(() => {
    return rawData.map(row => calculateMetrics(row, sensitivity));
  }, [rawData, sensitivity]);

  const totals = useMemo(() => {
    return aggregateMetrics(processedData);
  }, [processedData]);

  const handleDataUpload = (data) => {
    setRawData(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            Margin Protection Protocol
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Data Drives Decision
            {rawData.length > 0 && (
              <span style={{ 
                marginLeft: '1rem', 
                fontSize: '0.8rem', 
                background: 'rgba(245, 158, 11, 0.15)', /* warning color background */
                color: 'var(--accent-warning)',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem'
              }}>
                {rawData.length} items loaded
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {rawData.length > 0 && <ActionPanel sensitivity={sensitivity} setSensitivity={setSensitivity} data={processedData} />}
          <button 
            onClick={handleSignOut}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {rawData.length === 0 ? (
        <UploadSection onUpload={handleDataUpload} />
      ) : (
        <div className="animate-fade-in">
          <MetricsOverview totals={totals} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <ItemTable data={processedData} />
            <Visuals data={processedData} />
          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;
