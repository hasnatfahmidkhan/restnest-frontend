export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-heading font-bold mb-8">
        Terms & Conditions
      </h1>

      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-6">
        <p className="text-xs italic">Last updated: July 31, 2026</p>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using RestNest, you accept and agree to be bound by
            these Terms and Conditions. If you do not agree, please do not use
            our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            2. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Tenants:</strong> Must provide accurate information during
              rent requests and make timely payments upon approval.
            </li>
            <li>
              <strong>Landlords:</strong> Must list properties accurately,
              ensure they have the legal right to rent the property, and respond
              to requests promptly.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            3. Payments and Fees
          </h2>
          <p>
            Transactions are processed via secure third-party gateways
            (Stripe/SSLCommerz). RestNest is not liable for payment gateway
            failures but will assist in resolving disputes. Service fees may
            apply to certain transactions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            4. Account Suspension
          </h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms, engage in fraudulent activity, or compromise the safety
            of the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
