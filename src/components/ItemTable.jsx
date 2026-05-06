import React, { useState } from 'react';
import { ArrowUpDown, AlertCircle } from 'lucide-react';

const ItemTable = ({ data }) => {
  const [sortKey, setSortKey] = useState('costOfInaction');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedData = [...data].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const formatRM = (val) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MYR' }).format(val || 0).replace('MYR', 'RM');
    } catch (e) {
      return `RM ${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '0' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Item-Level Audit</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Prioritized by cost impact and churn risk</p>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Current Price <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('costOfInaction')} style={{ cursor: 'pointer' }}>
                Cost of Inaction <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('churnLimitPct')} style={{ cursor: 'pointer' }}>
                Churn Limit % <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('newPrice')} style={{ cursor: 'pointer' }}>
                Recommended Price <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('newProfit')} style={{ cursor: 'pointer' }}>
                New Profit <ArrowUpDown size={12} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{row.item}</td>
                <td>{formatRM(row.price)}</td>
                <td style={{ color: row.costOfInaction > 0 ? 'var(--accent-danger)' : 'inherit', fontWeight: 600 }}>
                  {formatRM(row.costOfInaction)}
                </td>
                <td>
                  <span className={`risk-tag ${row.churnLimitPct < 5 ? 'risk-high' : 'risk-low'}`}>
                    {row.churnLimitPct < 5 && <AlertCircle size={12} style={{ marginRight: '4px' }} />}
                    {(row.churnLimitPct || 0).toFixed(1)}%
                  </span>
                </td>
                <td>
                  <div style={{ 
                    fontWeight: 600, 
                    color: row.isAdjusted ? '#f97316' : '#ffffff' 
                  }}>
                    {formatRM(row.newPrice)}
                  </div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600,
                    marginTop: '2px',
                    color: row.isAdjusted ? '#f97316' : 'var(--accent-success)' 
                  }}>
                    +{formatRM(row.isAdjusted ? row.totalIncrement : row.baseIncrement)} / +{(row.isAdjusted ? row.totalHikePct : row.baseHikePct).toFixed(1)}%
                  </div>
                </td>
                <td style={{ color: 'var(--accent-success)', fontWeight: 600 }}>{formatRM(row.newProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;
