import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

const MetricsOverview = ({ totals }) => {
  const formatRM = (val) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MYR' }).format(val || 0).replace('MYR', 'RM');
    } catch (e) {
      return `RM ${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
  };

  const cards = [
    {
      label: 'Baseline Monthly Profit',
      value: formatRM(totals?.totalBaselineProfit || 0),
      icon: <TrendingUp size={20} />,
      type: 'primary'
    },
    {
      label: 'Cost of Inaction',
      value: formatRM(totals?.totalCostOfInaction || 0),
      icon: <AlertTriangle size={20} />,
      type: 'danger',
      subtitle: 'Profit loss if no adjustment',
      tooltip: "Money lost this month if you don't raise price"
    },
    {
      label: 'Profit Protocol Shift',
      value: formatRM(totals?.totalProtocolShift || 0),
      icon: <CheckCircle2 size={20} />,
      type: 'success',
      subtitle: 'Potential profit uplift'
    },
    {
      label: 'Avg. Churn Tolerance',
      value: `${(totals?.avgChurnLimit || 0).toFixed(1)}%`,
      icon: <Users size={20} />,
      type: 'neutral',
      subtitle: 'Safe customer attrition limit',
      tooltip: "% of customers you can lose and stay profitable"
    }
  ];

  return (
    <div className="stats-grid animate-fade-in">
      {cards.map((card, i) => (
        <div key={i} className={`card stat-card ${card.type}`} title={card.tooltip || ''}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">{card.label}</span>
            <div style={{ color: `var(--accent-${card.type === 'neutral' ? 'muted' : card.type})` }}>
              {card.icon}
            </div>
          </div>
          <div className="stat-value">{card.value}</div>
          {card.subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {card.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;
