import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { parseStatementWithGemini } from './geminiApi';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// Set up PDF.js worker using Vite's path resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();
pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`;

export async function processFile(file) {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    const text = await extractTextFromPDF(file);
    return parseStatementWithGemini(text);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileType === 'application/vnd.ms-excel' ||
    fileName.endsWith('.xlsx') ||
    fileName.endsWith('.xls')
  ) {
    return processExcel(file);
  } else if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
    return processCSV(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    const text = await readFileAsText(file);
    return parseStatementWithGemini(text);
  } else {
    throw new Error('Unsupported file format. Please upload PDF, XLSX, CSV, or TXT.');
  }
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

function processExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { 
          type: 'array',
          cellDates: true, 
          cellNF: true, 
          cellText: true 
        });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        const transactions = await getTransactionsWithFallback(json);
        resolve(transactions);
      } catch (err) {
        reject(new Error("Failed to parse Excel file: " + err.message));
      }
    };
    reader.onerror = (e) => reject(new Error("File read error"));
    reader.readAsArrayBuffer(file);
  });
}

function processCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: 'greedy',
      complete: async function(results) {
        try {
          const transactions = await getTransactionsWithFallback(results.data || []);
          resolve(transactions);
        } catch (err) {
          reject(new Error("Failed to parse CSV file: " + err.message));
        }
      },
      error: function(err) {
        reject(new Error("Failed to read CSV: " + err.message));
      }
    });
  });
}

async function getTransactionsWithFallback(rows) {
  try {
    const transactions = extractTransactionsFromRows(rows);
    if (transactions.length > 0) return transactions;
    // If 0 transactions found locally, proceed to AI fallback
  } catch (err) {
    // If local parsing failed due to column detection, proceed to AI fallback
    console.log("Local parsing failed, trying AI fallback:", err.message);
  }

  // AI Fallback: convert rows to text and let Gemini handle it
  const textRepresentation = tabularToText(rows);
  return parseStatementWithGemini(textRepresentation);
}

function tabularToText(rows) {
  // Take first 200 rows to avoid blowing up the prompt, 
  // though most statements aren't that long.
  return rows.slice(0, 500).map(row => 
    row.map(cell => (cell === null || cell === undefined) ? '' : String(cell)).join(' | ')
  ).join('\n');
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error("File read error"));
    reader.readAsText(file);
  });
}

function findHeaderRow(rows) {
  for (let i = 0; i < Math.min(50, rows.length); i++) {
    const row = rows[i].map(c => (c || '').toString().toLowerCase().trim());
    
    const hasDate = row.some(c => c.includes('date') || c === 'date' || c.includes('tran') || c.includes('txn') || c.includes('val dt'));
    const hasAmount = row.some(c => 
      c.includes('amount') || c.includes('debit') || c.includes('withdraw') || 
      c.includes('payment') || c.includes('credit') || c.includes('deposit') ||
      c.includes('balance') || c.includes('dr') || c.includes('cr') || c.includes('money') || c.includes('amt')
    );

    if (hasDate && hasAmount) {
      return i;
    }
  }
  return -1;
}

function detectColumns(headers) {
  const normalized = headers.map(h => (h || '').toString().toLowerCase().trim());

  const dateCol = normalized.findIndex(h =>
    h === 'date' || h.includes('date') || h.includes('tran') || h.includes('txn') || h.includes('value dt') || h.includes('val dt')
  );

  const descCol = normalized.findIndex(h =>
    h.includes('narration') || h.includes('description') || h.includes('particular') || 
    h.includes('details') || h.includes('remarks') || h.includes('transaction') || h.includes('desc') || h.includes('info')
  );

  const debitCol = normalized.findIndex(h =>
    h.includes('withdrawal') || h.includes('debit') || h.includes('dr') || 
    h.includes('paid out') || h.includes('money out') || (h.includes('amount') && (h.includes('dr') || h.includes('debit'))) ||
    h === 'withdrawal' || h === 'debit' || h.includes('out')
  );

  const creditCol = normalized.findIndex(h =>
    h.includes('deposit') || h.includes('credit') || h.includes('cr') || 
    h.includes('paid in') || h.includes('money in') || (h.includes('amount') && (h.includes('cr') || h.includes('credit'))) ||
    h === 'deposit' || h === 'credit' || h.includes('in')
  );

  const amountCol = normalized.findIndex(h =>
    h === 'amount' || h === 'transaction amount' || h.includes('txn amt') || h.includes('total amount') ||
    (h.includes('amount') && !h.includes('balance') && !h.includes('limit')) ||
    h === 'amt'
  );

  const typeCol = normalized.findIndex(h =>
    h === 'type' || h.includes('dr/cr') || h.includes('cr/dr') || h === 'tr type' || h.includes('transaction type') || h.includes('cr / dr')
  );

  return { dateCol, descCol, debitCol, creditCol, amountCol, typeCol };
}

function cleanAmount(val) {
  if (val === null || val === undefined || val === '') return NaN;
  let s = String(val).trim().replace(/,/g, '');
  // Handle (1,234.56) format for negative
  if (s.startsWith('(') && s.endsWith(')')) {
    s = '-' + s.substring(1, s.length - 1);
  }
  return parseFloat(s);
}

function extractTransactionsFromRows(rows) {
  const headerIdx = findHeaderRow(rows);
  if (headerIdx === -1) {
    throw new Error("Could not find a header row (Date/Amount). Ensure your file has these headers clearly visible in the first 50 rows.");
  }

  const columns = detectColumns(rows[headerIdx]);
  
  // Verify critical columns were found
  if (columns.dateCol === -1) {
    throw new Error("Could not identify the 'Date' column. Please check your file headers.");
  }
  if (columns.debitCol === -1 && columns.creditCol === -1 && columns.amountCol === -1) {
    throw new Error("Could not identify any Amount/Debit/Withdrawal columns. Please check your file headers.");
  }

  const transactions = [];
  
  // Potential date formats seen in Indian statements
  const dateFormats = ['DD-MM-YYYY', 'DD/MM/YYYY', 'DD-MMM-YYYY', 'DD MMM YYYY', 'YYYY-MM-DD', 'DD-MM-YY', 'D-M-YYYY', 'DD.MM.YYYY'];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    
    const dateRaw = row[columns.dateCol];
    if (!dateRaw || String(dateRaw).trim() === '') continue;

    // Skip summary rows
    const rowStr = row.join(' ').toLowerCase();
    if (rowStr.includes('opening balance') || rowStr.includes('closing balance') || rowStr.includes('total') || rowStr.includes('carried forward')) {
      continue;
    }

    let date = dayjs(dateRaw, dateFormats);
    if (!date.isValid()) {
      // Fallback to native parsing which is more robust for some strings
      const nativeDate = new Date(dateRaw);
      if (!isNaN(nativeDate.getTime())) {
        date = dayjs(nativeDate);
      } else {
        continue;
      }
    }

    let desc = String(row[columns.descCol] || 'No Description');
    let amount = 0;
    let type = 'debit';

    const debitVal = cleanAmount(row[columns.debitCol]);
    const creditVal = cleanAmount(row[columns.creditCol]);
    const amountVal = cleanAmount(row[columns.amountCol]);

    if (!isNaN(debitVal) && debitVal !== 0) {
      amount = Math.abs(debitVal);
      type = 'debit';
    } else if (!isNaN(creditVal) && creditVal !== 0) {
      amount = Math.abs(creditVal);
      type = 'credit';
    } else if (!isNaN(amountVal)) {
      amount = Math.abs(amountVal);
      if (columns.typeCol !== -1) {
        const typeRaw = String(row[columns.typeCol]).toLowerCase();
        type = typeRaw.includes('cr') || typeRaw.includes('credit') ? 'credit' : 'debit';
      } else {
        // If no type col, assume negative is debit
        type = amountVal < 0 ? 'debit' : 'credit';
      }
    } else {
      continue;
    }

    // Heuristic fallback: Re-evaluate debits if the description contains clear credit keywords
    // (Salary, Refund, Interest, Cashback, etc.)
    if (type === 'debit') {
      const descLower = desc.toLowerCase();
      const creditKeywords = ['salary', 'refund', 'cashback', 'interest', 'credit', 'deposit', 'received', 'credited'];
      if (creditKeywords.some(k => descLower.includes(k))) {
        type = 'credit';
      }
    }

    transactions.push({
      date: date.format('DD-MM-YYYY'),
      description: desc.trim(),
      amount: amount,
      type: type,
      category: 'Other'
    });
  }
  
  return transactions;
}
