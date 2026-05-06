import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';

const Visuals = ({ data }) => {
  // Top 8 items by cost of inaction for clarity
  const topItems = [...data]
    .sort((a, b) => b.costOfInaction - a.costOfInaction)
    .slice(0, 8);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card" style={{ padding: '0.75rem', fontSize: '0.8rem', backgroundColor: 'rgba(3, 7, 18, 0.9)' }}>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <p style={{ color: entry.color || entry.payload?.fill || 'var(--text-main)', margin: 0 }}>
                {entry.name}: {typeof entry.value === 'number' ? 
                  (entry.name.includes('%') ? `${entry.value.toFixed(1)}%` : `RM ${entry.value.toFixed(2)}`) 
                  : '0.00'}
              </p>
              {entry.payload?.volume && entry.name === 'Churn Limit %' && (
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                  Churn Capacity: {Math.floor((entry.value / 100) * entry.payload.volume).toLocaleString()} units of {entry.payload.volume.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-grid animate-fade-in">
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Cost Impact vs. Protocol Shift</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="item" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `RM${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36}/>
              <Bar name="Cost of Inaction" dataKey="costOfInaction" fill="var(--accent-danger)" radius={[4, 4, 0, 0]} />
              <Bar name="Profit Gain (Protocol)" dataKey="profitGain" fill="var(--accent-success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Churn Tolerance %</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={topItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <YAxis 
                dataKey="item" 
                type="category" 
                stroke="var(--text-muted)" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                width={120}
                tick={({ x, y, payload }) => (
                  <text x={x - 10} y={y} dy={4} textAnchor="end" fill="var(--text-main)" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {payload.value}
                  </text>
                )}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
              <Bar 
                name="Churn Limit %" 
                dataKey="churnLimitPct" 
                radius={[0, 4, 4, 0]}
              >
                {topItems.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.churnLimitPct < 5 ? 'var(--accent-danger)' : 'var(--accent-success)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Visuals;
