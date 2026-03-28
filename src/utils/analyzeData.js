export function analyzeTransactions(transactions) {
  let totalIn = 0;
  let totalOut = 0;
  
  const categorySpending = {};
  const dailySpending = {};
  const payeeFrequency = {};

  transactions.forEach(t => {
    const amount = Math.abs(Number(t.amount || 0));
    const type = String(t.type || 'debit').toLowerCase();
    
    if (type === 'credit' || type === 'cr') {
      totalIn += amount;
    } else if (type === 'debit' || type === 'dr') {
      totalOut += amount;
      
      // Category aggregation
      const cat = t.category || 'Other';
      categorySpending[cat] = (categorySpending[cat] || 0) + amount;
      
      // Daily aggregation
      const date = t.date;
      if (date) {
        dailySpending[date] = (dailySpending[date] || 0) + amount;
      }
      
      // Track top payees (simplified by using description as payee name)
      // A more robust implementation might clean up standard prefixes like "UPI-"
      const cleanDesc = t.description.replace(/^(UPI-|POS-)/i, '').split('/')[0].trim();
      if (!payeeFrequency[cleanDesc]) {
        payeeFrequency[cleanDesc] = { name: cleanDesc, count: 0, totalAmount: 0 };
      }
      payeeFrequency[cleanDesc].count += 1;
      payeeFrequency[cleanDesc].totalAmount += amount;
    }
  });

  // Format pie chart data
  const pieData = Object.entries(categorySpending).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  // Format bar chart data. Assuming date is DD-MM-YYYY
  const barData = Object.entries(dailySpending)
    .map(([date, amount]) => {
      // Very basic date parsing for sorting purposes DD-MM-YYYY
      const parts = date.split('-');
      const sortKey = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : date;
      return { date, amount, sortKey };
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ date, amount }) => ({ date, amount }));

  // Top payees
  const topPayees = Object.values(payeeFrequency)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);

  return {
    summary: {
      totalIn,
      totalOut,
      netBalance: totalIn - totalOut,
      totalTransactions: transactions.length
    },
    categoryData: pieData,
    dailyData: barData,
    topPayees: topPayees
  };
}
