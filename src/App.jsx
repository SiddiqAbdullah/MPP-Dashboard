import React, { useState, useMemo } from 'react';
import { calculateMetrics, aggregateMetrics } from './utils/metrics';
import MetricsOverview from './components/MetricsOverview';
import ItemTable from './components/ItemTable';
import Visuals from './components/Visuals';
import UploadSection from './components/UploadSection';
import ActionPanel from './components/ActionPanel';
import { ShieldAlert, TrendingUp, BarChart3 } from 'lucide-react';

function App() {
  const [rawData, setRawData] = useState([]);
  const [sensitivity, setSensitivity] = useState(0); // 0% adjustment by default

  const processedData = useMemo(() => {
    return rawData.map(row => calculateMetrics(row, sensitivity));
  }, [rawData, sensitivity]);

  const totals = useMemo(() => {
    return aggregateMetrics(processedData);
  }, [processedData]);

  const handleDataUpload = (data) => {
    setRawData(data);
  };

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        {rawData.length > 0 && <ActionPanel sensitivity={sensitivity} setSensitivity={setSensitivity} data={processedData} />}
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

export default App;
