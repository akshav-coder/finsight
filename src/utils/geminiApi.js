import { GoogleGenerativeAI } from '@google/generative-ai';
import { scrubPII } from './privacyScrubber';
import { auth } from '../config/firebase';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isAIEnabled = import.meta.env.VITE_ENABLE_AI === 'true';

// The /api/gemini proxy requires a signed-in Firebase user so anonymous
// scripts can't call it directly and run up the API bill.
async function getAuthHeaders() {
  if (!auth.currentUser) {
    throw new Error('Please sign in with Google to use AI features.');
  }
  const idToken = await auth.currentUser.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  };
}

/**
 * Extracts transactions from a bank statement.
 * In production or if the local API key is missing, it proxies requests through Vercel serverless functions.
 * In local development (with key), it falls back to the direct browser SDK for convenience.
 * @param {string} text Raw statement text
 * @returns {Promise<Array>} Transaction array
 */
export async function parseStatementWithGemini(text) {
  if (!isAIEnabled) {
    throw new Error("AI Parsing is temporarily disabled in this version.");
  }

  // Scrub Personal Identifiable Information (PII) before transmission to protect privacy
  const scrubbedText = scrubPII(text);

  // 1. In Production, OR if VITE_GEMINI_API_KEY is not defined locally, fetch from secure Vercel API proxy
  if (import.meta.env.PROD || !apiKey) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ text: scrubbedText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Backend Proxy Gemini Error:", error);
      throw new Error(`AI Parsing Error: ${error.message}`);
    }
  }

  // 2. Local Development fallback (if VITE_GEMINI_API_KEY is configured in .env files)
  console.log("Using direct client-side SDK local fallback parser (development mode)");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
  });

  const prompt = `Extract all transactions from this bank statement.
Return ONLY a raw JSON array. 
No markdown. No code blocks. No backticks. No explanation. 
Start your response with [ and end with ].
Each object must have: date, description, amount, type, category.
IMPORTANT: 'type' MUST be either 'credit' (money in/salary/refunds) or 'debit' (money out/spending).
The 'amount' should ALWAYS be a positive number. The 'type' will indicate the direction.

Bank statement text:
${scrubbedText}`;

  function cleanJSON(txt) {
    txt = txt.replace(/```json/gi, '').replace(/```/g, '');
    const start = txt.indexOf('[');
    const end = txt.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('No JSON array found');
    return txt.slice(start, end + 1).trim();
  }

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const cleaned = cleanJSON(raw);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error(error.message.replace(/^AI Parsing Error: /i, ''));
  }
}

/**
 * Gets open-ended advisory responses from Gemini.
 * Proxies requests securely through Vercel serverless functions in production.
 * @param {string} prompt Open-ended prompt for Gemini
 * @returns {Promise<string>} Gemini response text
 */
export async function getGeminiResponse(prompt) {
  if (!isAIEnabled) {
    return "AI insights are coming soon to the live version of FinSight! Stay tuned.";
  }

  // 1. In Production, OR if VITE_GEMINI_API_KEY is not defined locally, fetch from secure Vercel API proxy
  if (import.meta.env.PROD || !apiKey) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Backend Proxy Gemini Advisor Error:", error);
      throw new Error(`AI Advisor Error: ${error.message}`);
    }
  }

  // 2. Local Development fallback (if VITE_GEMINI_API_KEY is configured in .env files)
  console.log("Using direct client-side SDK local fallback advisor (development mode)");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Response Error:", error);
    throw error;
  }
}

export function generateTaxAdvisorPrompt({
  annualIncome,
  current80C,
  limit80C,
  premium80D,
  nps,
  hraSituation,
  homeLoanInterest,
  oldRegimeTax,
  newRegimeTax,
  extraSavingsPossible
}) {
  return `You are a CA (Chartered Accountant) in India.
The user is a salaried employee with:
Annual Income: ${annualIncome}
Current 80C investments: ${current80C} (limit ${limit80C})
80D premium paid: ${premium80D}
NPS: ${nps}
HRA situation: ${hraSituation}
Home loan interest: ${homeLoanInterest}

Old Regime Tax: ${oldRegimeTax}
New Regime Tax: ${newRegimeTax}
Additional tax saving possible: ${extraSavingsPossible}

Write 4-5 lines max.
1. Which regime to choose and exactly why.
2. Top 2 specific actions to reduce tax.
3. One thing most people miss.
4. Urgency if financial year ending soon.

Use Indian number format.
No markdown. Sound like a friendly CA, not a textbook. Be direct and encouraging.`;
}

export function generateSIPAdvisorPrompt({
  monthly,
  years,
  rate,
  totalInvested,
  maturityValue,
  wealthGained,
  goalName = null,
  requiredSIP = null
}) {
  let baseContext = `The user plans to invest ₹${monthly}/month via SIP for ${years} years at ${rate}% expected returns.
They will invest ₹${totalInvested} total and get ₹${maturityValue} at maturity.
Wealth gained: ₹${wealthGained}.`;

  if (goalName) {
    baseContext = `The user's goal is to fund their [${goalName}] worth ₹${maturityValue} in ${years} years.
To achieve this at an expected return of ${rate}%, they need a Required monthly SIP of ₹${requiredSIP}.`;
  }

  return `You are a friendly wealth coach for young Indians.
${baseContext}

Write 3-4 lines max:
1. Is this a realistic and good plan?
2. Which type of mutual fund suits this goal (Large cap/Mid cap/ELSS/Index fund)?
3. One specific motivation or insight about their wealth journey.

Use Indian number format (lakhs/crores).
Sound excited and encouraging. No markdown.`;
}
