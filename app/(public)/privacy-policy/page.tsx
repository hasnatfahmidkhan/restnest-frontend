export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-heading font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-6">
        <p className="text-xs italic">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            1. Introduction
          </h2>
          <p>
            Welcome to RestNest. We are committed to protecting your privacy and
            ensuring that your personal information is protected in accordance
            with applicable data protection laws. This policy explains how we
            collect, use, and share your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            2. Information We Collect
          </h2>
          <p>We collect various types of information, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number,
              and NID/ID provided during registration.
            </li>
            <li>
              Payment Information: Handled securely via SSLCommerz/Stripe. We do
              not store full credit card details on our servers.
            </li>
            <li>Usage Data: IP address, browser type, and pages visited.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            3. How We Use Your Information
          </h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Facilitate rentals between tenants and landlords.</li>
            <li>Process payments securely.</li>
            <li>
              Notify you about request approvals, rejections, or platform
              updates.
            </li>
            <li>Maintain the security and integrity of our platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">
            4. Data Security
          </h2>
          <p>
            We implement appropriate technical and organizational measures (such
            as encrypted JWT tokens and HTTP-only cookies) to protect your data
            from unauthorized access, alteration, or disclosure.
          </p>
        </section>
      </div>
    </div>
  );
}
