import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const DATE_FORMATS = ['DD-MM-YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD MMM YYYY', 'DD-MMM-YYYY'];

function parseDateRobust(dateStr) {
  if (!dateStr) return null;
  let d = dayjs(dateStr, DATE_FORMATS);
  if (!d.isValid()) {
    const nativeDate = new Date(dateStr);
    if (!isNaN(nativeDate.getTime())) {
      d = dayjs(nativeDate);
    }
  }
  return d.isValid() ? d.valueOf() : null;
}

function cleanPayeeName(description) {
  if (!description) return "Unknown";
  
  let cleaned = String(description);

  const prefixRegex = /^(UPI[\-\/]|NEFT[\-\/]|IMPS[\-\/]|RTGS[\-\/]|POS[\-\/]|ACH[\-\/]|MMT\/|TP\/|P2A\/|P2M\/|TSF\/)/i;
  let prevCleaned;
  do {
    prevCleaned = cleaned;
    cleaned = cleaned.replace(prefixRegex, '');
  } while (cleaned !== prevCleaned);

  const refRegex = /(?:\/REF|\/Ref|REF NO|TRAN|\/[A-Z0-9]{8,}).*$/i;
  cleaned = cleaned.replace(refRegex, '');

  const vpaRegex = /@[A-Z0-9]+/i;
  cleaned = cleaned.replace(vpaRegex, '');

  cleaned = cleaned.replace(/[\/\-]+/g, ' ').trim();

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  cleaned = toTitleCase(cleaned);

  if (cleaned.length < 3) {
    let fallback = String(description).trim();
    if (fallback.length > 30) fallback = fallback.substring(0, 30) + '...';
    return toTitleCase(fallback);
  }

  return cleaned;
}

export function analyzeTransactions(transactions) {
  let totalIn = 0;
  let totalOut = 0;
  
  const categorySpending = {};
  const dailySpending = {};
  const payeeFrequency = {};

  const incomeCategorySpending = {};
  const dailyIncomeSpending = {};
  const incomeFrequency = {};

  transactions.forEach(t => {
    const amount = Math.abs(Number(t.amount || 0));
    const type = String(t.type || 'debit').toLowerCase();
    
    if (type === 'credit' || type === 'cr') {
      totalIn += amount;

      const cat = t.category || 'Other';
      incomeCategorySpending[cat] = (incomeCategorySpending[cat] || 0) + amount;
      
      const date = t.date;
      if (date) {
        dailyIncomeSpending[date] = (dailyIncomeSpending[date] || 0) + amount;
      }
      
      const cleanDesc = cleanPayeeName(t.description);
      if (!incomeFrequency[cleanDesc]) {
        incomeFrequency[cleanDesc] = { name: cleanDesc, count: 0, totalAmount: 0 };
      }
      incomeFrequency[cleanDesc].count += 1;
      incomeFrequency[cleanDesc].totalAmount += amount;

    } else if (type === 'debit' || type === 'dr') {
      totalOut += amount;
      
      const cat = t.category || 'Other';
      categorySpending[cat] = (categorySpending[cat] || 0) + amount;
      
      const date = t.date;
      if (date) {
        dailySpending[date] = (dailySpending[date] || 0) + amount;
      }
      
      const cleanDesc = cleanPayeeName(t.description);
      if (!payeeFrequency[cleanDesc]) {
        payeeFrequency[cleanDesc] = { name: cleanDesc, count: 0, totalAmount: 0 };
      }
      payeeFrequency[cleanDesc].count += 1;
      payeeFrequency[cleanDesc].totalAmount += amount;
    }
  });

  const pieData = Object.entries(categorySpending).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const incomeData = Object.entries(incomeCategorySpending).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const formatDailyData = (dailyMap) => Object.entries(dailyMap)
    .map(([date, amount]) => {
      return { date, amount, timestamp: parseDateRobust(date) };
    })
    .sort((a, b) => {
      if (a.timestamp === null && b.timestamp === null) return 0;
      if (a.timestamp === null) return 1;
      if (b.timestamp === null) return -1;
      return a.timestamp - b.timestamp;
    })
    .map(({ date, amount, timestamp }) => ({ date, amount, timestamp }));

  const barData = formatDailyData(dailySpending);
  const dailyIncomeData = formatDailyData(dailyIncomeSpending);

  const topPayees = Object.values(payeeFrequency)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);
    
  const topIncomeSources = Object.values(incomeFrequency)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  return {
    summary: {
      totalIn,
      totalOut,
      netBalance: totalIn - totalOut,
      totalTransactions: transactions.length
    },
    categoryData: pieData,
    dailyData: barData,
    topPayees: topPayees,
    incomeData,
    dailyIncomeData,
    topIncomeSources
  };
}
