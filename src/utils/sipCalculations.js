// Basic SIP Future Value
export function calculateSIP(monthly, annualRate, years) {
  if (annualRate === 0) return monthly * 12 * years;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  // FV = P × [(1+r)^n - 1] / r × (1+r)
  return monthly * (Math.pow(1 + r, n) - 1) / r * (1 + r);
}

// Step-up SIP calculation
export function calculateStepUpSIP(monthly, annualRate, years, stepUpPercent) {
  if (annualRate === 0 && stepUpPercent === 0) return monthly * 12 * years;
  
  const monthlyRate = annualRate / 100 / 12;
  const annualStepUp = stepUpPercent / 100;
  let totalValue = 0;
  let currentSIP = monthly;
  
  for (let year = 0; year < years; year++) {
    // Calculate value of this year's SIP at end of tenure
    const monthsThisYear = 12;
    const monthsRemaining = (years - year) * 12;
    
    // Calculate FV of just this year's 12 installments over the remaining tenure
    // FV = P * [ (1+r)^12 - 1 ] / r * (1+r) * (1+r)^(remaining months after this year)
    let yearValue = 0;
    if (monthlyRate === 0) {
       yearValue = currentSIP * 12;
    } else {
       const fvThisYear = currentSIP * (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate * (1 + monthlyRate);
       // Compound it for the remaining years
       const remainingYears = years - year - 1;
       yearValue = fvThisYear * Math.pow(1 + monthlyRate, remainingYears * 12);
    }
    
    totalValue += yearValue;
    currentSIP *= (1 + annualStepUp);
  }
  return totalValue;
}

// Reverse SIP — how much to invest for goal
export function calculateRequiredSIP(targetAmount, annualRate, years) {
  if (annualRate === 0) return targetAmount / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return targetAmount * r / ((Math.pow(1 + r, n) - 1) * (1 + r));
}

export function calculateRequiredStepUpSIP(targetAmount, annualRate, years, stepUpPercent) {
  // We need to find the initial 'monthly' SIP that satisfies the target.
  // We can do this by finding the multiplier for a base SIP of 1.
  const multiplier = calculateStepUpSIP(1, annualRate, years, stepUpPercent);
  return targetAmount / multiplier;
}

// Generate year-by-year schedule
export function generateSIPSchedule(monthly, annualRate, years, stepUpPercent = 0) {
  const schedule = [];
  let currentSIP = monthly;
  let totalInvested = 0;
  let totalValueAtStartOfYear = 0;
  const monthlyRate = annualRate / 100 / 12;
  const annualStepUp = stepUpPercent / 100;

  for (let year = 1; year <= years; year++) {
    // Add 12 months of current SIP
    const investedThisYear = currentSIP * 12;
    totalInvested += investedThisYear;
    
    let valueAtEndOfYear = 0;
    if (monthlyRate === 0) {
      valueAtEndOfYear = totalValueAtStartOfYear + investedThisYear;
    } else {
      // Previous corpus grows by 1 year
      const grownCorpus = totalValueAtStartOfYear * Math.pow(1 + monthlyRate, 12);
      // New contributions grow
      const newContributionsFV = currentSIP * (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate * (1 + monthlyRate);
      valueAtEndOfYear = grownCorpus + newContributionsFV;
    }

    schedule.push({
      year,
      monthlySIP: currentSIP,
      invested: totalInvested,
      returns: Math.max(0, valueAtEndOfYear - totalInvested),
      totalValue: valueAtEndOfYear,
      growthPercent: totalInvested > 0 ? Math.max(0, (valueAtEndOfYear - totalInvested) / totalInvested * 100) : 0
    });

    totalValueAtStartOfYear = valueAtEndOfYear;
    currentSIP *= (1 + annualStepUp);
  }
  return schedule;
}

// Step-up total invested amount
export function totalStepUpInvested(monthly, years, stepUpPercent) {
  let total = 0;
  let current = monthly;
  for (let year = 0; year < years; year++) {
    total += current * 12;
    current *= (1 + stepUpPercent / 100);
  }
  return total;
}

// Helper to format currency
export const formatINR = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Helper for large numbers explicitly (like 1.7Cr, 50L)
export const formatINRLarge = (value) => {
   if (value === undefined || value === null || isNaN(value)) return '₹0';
   
   if (value >= 10000000) {
     return `₹${(value / 10000000).toFixed(2)} Cr`;
   } else if (value >= 100000) {
     return `₹${(value / 100000).toFixed(2)} L`;
   }
   return formatINR(value);
};
