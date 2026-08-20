import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyFirebaseToken } from './_lib/verifyFirebaseToken.js';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const MAX_STATEMENT_TEXT_LENGTH = 60000; // ~ a very long multi-page statement
const MAX_PROMPT_LENGTH = 4000; // advisor prompts are short, generated client-side from form inputs

/**
 * Vercel Serverless Function: /api/gemini
 * Secure proxy to Google Gemini. Requires a valid Firebase Auth ID token
 * (Authorization: Bearer <idToken>) so anonymous scripts/bots can't run up
 * the API bill, and caps input/output size to bound cost per call.
 *
 * Supports:
 *  1. Statement Parsing: Pass a 'text' parameter (returns JSON array).
 *  2. Advisory Insights: Pass a 'prompt' parameter (returns text answer).
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST instead.' });
  }

  let user;
  try {
    user = await verifyFirebaseToken(req);
  } catch (err) {
    return res.status(401).json({ error: `Unauthorized: ${err.message}` });
  }

  const { text, prompt: clientPrompt } = req.body || {};
  if (!text && !clientPrompt) {
    return res.status(400).json({ error: 'Invalid Request. Missing "text" or "prompt" in request body.' });
  }
  if (text && text.length > MAX_STATEMENT_TEXT_LENGTH) {
    return res.status(413).json({ error: 'Statement text too long.' });
  }
  if (clientPrompt && clientPrompt.length > MAX_PROMPT_LENGTH) {
    return res.status(413).json({ error: 'Prompt too long.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server Misconfiguration: GEMINI_API_KEY environment variable is not configured on the Vercel server.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { maxOutputTokens: 1024 },
    });

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
    console.error(`Serverless Proxy Gemini Error (uid=${user.sub}):`, error);
    return res.status(500).json({ error: error.message || 'Failed to query AI models' });
  }
}
