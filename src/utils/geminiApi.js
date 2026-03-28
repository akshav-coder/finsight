import { GoogleGenerativeAI } from '@google/generative-ai';

// In a real production app, you would pass this through your backend to keep it secure.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isAIEnabled = import.meta.env.VITE_ENABLE_AI === 'true';

export async function parseStatementWithGemini(text) {
  if (!isAIEnabled) {
    throw new Error("AI Parsing is temporarily disabled in this version.");
  }
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in your environment variables. Please add it to .env files and restart the server.");
  }

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
${text}`;

  function cleanJSON(text) {
    // Remove markdown code blocks
    text = text.replace(/```json/gi, '').replace(/```/g, '');
    // Find the first [ and last ] and extract only that
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('No JSON array found');
    return text.slice(start, end + 1).trim();
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

export async function getGeminiResponse(prompt) {
  if (!isAIEnabled) {
    return "AI insights are coming soon to the live version of FinSight! Stay tuned.";
  }
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set.");
  }

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
\${baseContext}

Write 3-4 lines max:
1. Is this a realistic and good plan?
2. Which type of mutual fund suits this goal (Large cap/Mid cap/ELSS/Index fund)?
3. One specific motivation or insight about their wealth journey.

Use Indian number format (lakhs/crores).
Sound excited and encouraging. No markdown.`;
}
