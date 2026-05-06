/**
 * Margin Protection Protocol - Metrics Engine
 */

export const calculateMetrics = (row, sensitivityAdjustment = 0) => {
  const sanitize = (val) => {
    if (typeof val !== 'string') return val;
    return val.replace(/[^0-9.-]/g, '');
  };

  const price = parseFloat(sanitize(row.current_price)) || 0;
  const cost = parseFloat(sanitize(row.cost)) || 0;
  const volume = parseFloat(sanitize(row.monthly_volume)) || 0;
  
  const costIncBaseRaw = parseFloat(sanitize(row.cost_increase_pct)) || 0;
  const costIncBase = costIncBaseRaw / 100;
  const costIncTotal = (costIncBaseRaw + sensitivityAdjustment) / 100;
  
  const baselineProfit = (price - cost) * volume;
  const baselineUnitMargin = price - cost;

  // Logic: Calculate Recommended Price 
  const getRecPrice = (inc) => {
    const newCost = cost * (1 + inc);
    const minPrice = baselineUnitMargin + newCost;
    const targetPrice = baselineUnitMargin + (newCost * 1.10);
    return Math.max(minPrice, targetPrice);
  };

  // Current State (with sensitivity)
  const newPrice = getRecPrice(costIncTotal);
  const newCost = cost * (1 + costIncTotal);
  const newUnitMargin = newPrice - newCost;
  const newProfit = newUnitMargin * volume;
  const profitGain = newProfit - baselineProfit;
  
  const totalIncrement = newPrice - price;
  const totalHikePct = (totalIncrement / price) * 100;

  // Base State (CSV only)
  const baseRecPrice = getRecPrice(costIncBase);
  const baseIncrement = baseRecPrice - price;
  const baseHikePct = (baseIncrement / price) * 100;

  let churnLimitPct = 0;
  if (profitGain > 0 && newUnitMargin > 0 && volume > 0) {
    const churnableSales = profitGain / newUnitMargin;
    churnLimitPct = (churnableSales / volume) * 100;
  }
  if (!isFinite(churnLimitPct) || isNaN(churnLimitPct)) churnLimitPct = 0;

  const profitIfNoAction = (price - newCost) * volume;
  const costOfInaction = baselineProfit - profitIfNoAction;

  return {
    item: row.item,
    price,
    cost,
    volume,
    newPrice,
    newCost,
    newUnitMargin,
    baselineProfit,
    newProfit,
    profitGain,
    churnLimitPct,
    costOfInaction,
    protocolShift: profitGain,
    baseIncrement,
    baseHikePct,
    totalIncrement,
    totalHikePct,
    isAdjusted: sensitivityAdjustment > 0
  };
};

export const aggregateMetrics = (data) => {
  const totalBaselineProfit = data.reduce((sum, item) => sum + item.baselineProfit, 0);
  const totalCostOfInaction = data.reduce((sum, item) => sum + item.costOfInaction, 0);
  const totalProtocolShift = data.reduce((sum, item) => sum + item.protocolShift, 0);
  
  const avgChurnLimit = data.length > 0 
    ? data.reduce((sum, item) => sum + item.churnLimitPct, 0) / data.length 
    : 0;

  return {
    totalBaselineProfit: isFinite(totalBaselineProfit) ? totalBaselineProfit : 0,
    totalCostOfInaction: isFinite(totalCostOfInaction) ? totalCostOfInaction : 0,
    totalProtocolShift: isFinite(totalProtocolShift) ? totalProtocolShift : 0,
    avgChurnLimit: isFinite(avgChurnLimit) ? avgChurnLimit : 0
  };
};
