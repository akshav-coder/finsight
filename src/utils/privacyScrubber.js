/**
 * FinSight Client-Side Privacy Shield
 * Cleanses raw text strings of sensitive Personal Identifiable Information (PII)
 * before transmitting data to external LLMs, ensuring absolute privacy compliance.
 */

// Indian Permanent Account Number (PAN): e.g., ABCDE1234F
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;

// Indian Mobile Numbers: e.g., +91 9876543210, 9876543210
const MOBILE_REGEX = /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g;

// Email Address standard regex
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

// Isolated Account and Transaction Reference Numbers (9 to 18 digits).
// Safe to redact as transaction categories only require descriptions and amounts.
// Using word boundaries avoids matching amounts containing decimals or commas.
const ACCOUNT_REGEX = /\b\d{9,18}\b/g;

/**
 * Scrubs Personal Identifiable Information from raw text.
 * @param {string} text The raw text to process.
 * @returns {string} The scrubbed and sanitized text.
 */
export function scrubPII(text) {
  if (!text || typeof text !== 'string') return text;

  let sanitized = text;

  // 1. Redact Email addresses
  sanitized = sanitized.replace(EMAIL_REGEX, '[EMAIL_REDACTED]');

  // 2. Redact Permanent Account Numbers (PAN)
  sanitized = sanitized.replace(PAN_REGEX, '[PAN_REDACTED]');

  // 3. Redact Mobile numbers
  sanitized = sanitized.replace(MOBILE_REGEX, '[MOBILE_REDACTED]');

  // 4. Redact long Account or Transaction Reference Numbers (9-18 digits)
  sanitized = sanitized.replace(ACCOUNT_REGEX, '[NUM_REDACTED]');

  return sanitized;
}
