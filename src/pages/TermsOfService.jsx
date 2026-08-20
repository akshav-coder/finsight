import LegalPageLayout from '../components/LegalPageLayout';

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" updatedDate="20 August 2026">
      <section>
        <h2>1. What FinSight is</h2>
        <p>
          FinSight is a set of financial calculators and an AI-assisted bank statement analyzer for
          personal use, provided free with an optional paid Pro plan. It's a self-serve tool, not a
          bank, broker, or licensed financial advisor.
        </p>
      </section>

      <section>
        <h2>2. Not financial, tax, or investment advice</h2>
        <p>
          Everything FinSight shows you — tax regime comparisons, loan/EMI breakdowns, SIP
          projections, AI-generated insights, or anything else — is for informational and
          educational purposes only. It is not professional financial, tax, legal, or investment
          advice, and you shouldn't treat it as such. Tax rules, interest rates, and regulations
          change, and calculations may not account for your complete personal situation. Before
          making financial decisions, consult a qualified Chartered Accountant, financial advisor,
          or the relevant authority. We are not liable for decisions made based on FinSight's
          output.
        </p>
      </section>

      <section>
        <h2>3. AI-generated content</h2>
        <p>
          Statement parsing and AI advisor features use Google's Gemini AI model. AI output can be
          wrong, incomplete, or miscategorize transactions — always verify important figures
          yourself, especially before filing taxes or making payments based on them.
        </p>
      </section>

      <section>
        <h2>4. Your account</h2>
        <p>
          Signing in with Google is required only for the Statement Analyzer and Savings Advisor.
          You're responsible for keeping your Google account secure. We may suspend accounts used
          to abuse the service (e.g. scripting against our API, attempting to bypass usage limits
          or payment verification).
        </p>
      </section>

      <section>
        <h2>5. Free plan and Pro plan</h2>
        <p>
          The Free plan includes limited monthly statement uploads and full access to all
          calculators. The Pro plan (₹199/month, when enabled) removes the upload limit and unlocks
          additional features, and is billed through Razorpay. Pro plan status is granted only
          after a payment is cryptographically verified — see our Privacy Policy for how this
          works.
        </p>
      </section>

      <section>
        <h2>6. Refunds</h2>
        <p>
          [Fill in your actual refund policy here before enabling payments — e.g. "Refund requests
          within 7 days of a charge, contact [email], processed within X business days." This is a
          placeholder, not a real policy.]
        </p>
      </section>

      <section>
        <h2>7. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Upload statements or data that aren't yours or that you don't have the right to use.</li>
          <li>Attempt to bypass upload limits, payment verification, or reverse-engineer our AI proxy.</li>
          <li>Use FinSight for anything unlawful, or to scrape/resell our calculators.</li>
        </ul>
      </section>

      <section>
        <h2>8. No warranty</h2>
        <p>
          FinSight is provided "as is," without warranties of any kind. We don't guarantee the
          service will be uninterrupted, error-free, or that calculations will be perfectly
          accurate for your situation.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, FinSight and its operators aren't liable for any
          indirect, incidental, or consequential damages — including financial losses — arising
          from your use of the service or reliance on its calculations or AI output.
        </p>
      </section>

      <section>
        <h2>10. Changes</h2>
        <p>We may update these terms as the product changes. Continued use after an update means you accept the revised terms.</p>
      </section>

      <section>
        <h2>11. Governing law</h2>
        <p>These terms are governed by the laws of India.</p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Questions about these terms: <a href="mailto:REPLACE_WITH_SUPPORT_EMAIL">REPLACE_WITH_SUPPORT_EMAIL</a>
        </p>
      </section>

      <section>
        <p className="text-sm italic">
          This is a starting template based on FinSight's actual features, not a substitute for
          legal advice. Have it reviewed by a lawyer before you start charging real users —
          especially the refund and liability sections.
        </p>
      </section>
    </LegalPageLayout>
  );
}
