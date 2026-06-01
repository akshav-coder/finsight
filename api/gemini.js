import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Vercel Serverless Function: /api/gemini
 * Acts as a secure proxy to interact with the Google Gemini API.
 * Supports:
 *  1. Statement Parsing: Pass a 'text' parameter (returns JSON array).
 *  2. Advisory Insights: Pass a 'prompt' parameter (returns text answer).
 */
export default async function handler(req, res) {
  // CORS Headers for safety
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST instead.' });
  }

  const { text, prompt: clientPrompt } = req.body || {};
  if (!text && !clientPrompt) {
    return res.status(400).json({ error: 'Invalid Request. Missing "text" or "prompt" in request body.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server Misconfiguration: GEMINI_API_KEY environment variable is not configured on the Vercel server.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let finalPrompt = '';
    if (text) {
      finalPrompt = `Extract all transactions from this bank statement.
Return ONLY a raw JSON array. 
No markdown. No code blocks. No backticks. No explanation. 
Start your response with [ and end with ].
Each object must have: date, description, amount, type, category.
IMPORTANT: 'type' MUST be either 'credit' (money in/salary/refunds) or 'debit' (money out/spending).
The 'amount' should ALWAYS be a positive number. The 'type' will indicate the direction.

Bank statement text:
${text}`;
    } else {
      finalPrompt = clientPrompt;
    }

    const result = await model.generateContent(finalPrompt);
    const raw = result.response.text();

    if (text) {
      // Structured JSON cleanup for transaction parsing
      function cleanJSON(jsonText) {
        jsonText = jsonText.replace(/```json/gi, '').replace(/```/g, '');
        const start = jsonText.indexOf('[');
        const end = jsonText.lastIndexOf(']');
        if (start === -1 || end === -1) throw new Error('No JSON array found in Gemini response');
        return jsonText.slice(start, end + 1).trim();
      }

      const cleaned = cleanJSON(raw);
      const parsed = JSON.parse(cleaned);
      return res.status(200).json(parsed);
    } else {
      // Text response for conversational advisors
      return res.status(200).json({ response: raw });
    }
  } catch (error) {
    console.error('Serverless Proxy Gemini Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to query AI models' });
  }
}
