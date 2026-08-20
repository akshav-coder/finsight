import LegalPageLayout from '../components/LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" updatedDate="20 August 2026">
      <section>
        <h2>The short version</h2>
        <p>
          FinSight's calculators run entirely in your browser and store nothing on our servers.
          If you use the Statement Analyzer, the text of your statement is sent to our AI provider
          (Google Gemini) to extract transactions — personal identifiers are stripped first, and
          the text is discarded immediately after processing, not stored anywhere. If you sign in
          with Google, we keep a small account record (your upload count and subscription status)
          — never your financial data.
        </p>
      </section>

      <section>
        <h2>1. What we collect</h2>
        <p><strong>If you never sign in</strong> (all calculators — Loan, Credit Card, FD/RD, Debt Planner, Tax Saver, SIP): we collect nothing. Your inputs stay in your browser's local storage (IndexedDB) on your own device.</p>
        <p><strong>If you sign in with Google</strong> (required for the Statement Analyzer and Savings Advisor): we store, via Firebase, your Google account's name, email, and a unique ID, plus a small record of your monthly upload count and whether you're on the Pro plan. We do not store your bank statement, transactions, or any financial figures on our servers or in this database.</p>
        <p><strong>If you upload a bank statement</strong>: the file is processed in your browser. For PDF/text statements, the extracted text — with your PAN, phone number, email, and account/reference numbers automatically redacted first — is sent to our server, which forwards it to Google's Gemini API to identify transactions. The response is returned to your browser and stored only in your browser's local storage (IndexedDB), never on our servers. We do not retain a copy of this text after the request completes.</p>
        <p><strong>If you upgrade to Pro</strong>: payment is handled entirely by Razorpay. We never see or store your card, UPI, or bank details — Razorpay sends us only a confirmation that a specific payment succeeded, which we verify cryptographically before marking your account as Pro.</p>
      </section>

      <section>
        <h2>2. What we don't do</h2>
        <ul>
          <li>We don't use analytics or advertising trackers, and we don't set tracking cookies.</li>
          <li>We don't sell, rent, or share your data with third parties for marketing.</li>
          <li>We don't store your bank statement, transaction history, or account numbers on our servers.</li>
          <li>We don't require an account to use any of the calculators.</li>
        </ul>
      </section>

      <section>
        <h2>3. Third parties we rely on</h2>
        <ul>
          <li><strong>Google Firebase</strong> — authentication (Google Sign-In) and the small account record described above.</li>
          <li><strong>Google Gemini API</strong> — parses statement text into transactions, and generates the optional AI advisor insights, only when you sign in and trigger these features.</li>
          <li><strong>Razorpay</strong> — processes Pro plan payments. Subject to Razorpay's own privacy policy.</li>
          <li><strong>Google Fonts</strong> — loads our typeface from Google's font CDN.</li>
        </ul>
        <p>Each of these may process data under their own privacy policies as sub-processors acting on our instructions, or as independent controllers for payments.</p>
      </section>

      <section>
        <h2>4. Your rights</h2>
        <p>
          Under India's Digital Personal Data Protection Act, 2023, you can request access to,
          correction of, or erasure of any account data we hold about you (your name, email, upload
          count, and Pro status). Since we don't store your financial data in the first place,
          there's nothing further to erase there. To make a request, or to delete your account
          entirely, contact us at the email below.
        </p>
      </section>

      <section>
        <h2>5. Data retention</h2>
        <p>
          Account records (email, upload count, Pro status) are kept for as long as your account
          exists, and deleted on request. Statement text sent for AI parsing is not retained after
          the request completes. Your parsed transactions and calculator inputs live only in your
          browser's local storage — clearing your browser data or using a different device removes
          them.
        </p>
      </section>

      <section>
        <h2>6. Children's privacy</h2>
        <p>FinSight is not directed at children under 18 and we don't knowingly collect data from them.</p>
      </section>

      <section>
        <h2>7. Changes to this policy</h2>
        <p>If this policy changes materially, we'll update the date at the top of this page.</p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          Questions, data requests, or account deletion requests:{' '}
          <a href="mailto:REPLACE_WITH_SUPPORT_EMAIL">REPLACE_WITH_SUPPORT_EMAIL</a>
        </p>
      </section>

      <section>
        <p className="text-sm italic">
          This policy describes FinSight's actual technical practices as of the date above, but
          isn't a substitute for legal advice. If you're relying on this for regulatory compliance,
          have it reviewed by a lawyer familiar with India's DPDP Act before launch.
        </p>
      </section>
    </LegalPageLayout>
  );
}
