import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Search & Filter",
      desc: "Browse verified properties and narrow down your options by location, price, bedrooms, amenities, and more.",
    },
    {
      icon: KeyRound,
      number: "02",
      title: "Request & Approve",
      desc: "Found the right place? Send a rental request with your details and let the landlord review your application.",
    },
    {
      icon: CreditCard,
      number: "03",
      title: "Pay & Move In",
      desc: "Once approved, complete your payment securely and get ready to move into your new home.",
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-5">
            <CheckCircle2 className="w-4 h-4" />
            Simple & Hassle-Free
          </div>

          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            Find Your Next Home in{" "}
            <span className="text-primary">3 Simple Steps</span>
          </h2>

          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            From discovering the right property to getting the keys, RestNest
            makes the entire rental journey simple, transparent, and convenient.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="sticky top-24 bg-card border border-border rounded-3xl p-7 md:p-8 shadow-sm flex flex-col md:flex-row items-start gap-6"
              style={{ top: `${96 + i * 20}px` }}
            >
              {/* Icon */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-primary mb-1">
                  STEP {step.number}
                </p>

                <h3 className="text-2xl font-heading font-bold mb-2">
                  {step.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to find a place you’ll love?
          </p>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Explore Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust points */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Verified Properties
          </span>

          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Secure Payments
          </span>

          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Easy Rental Process
          </span>
        </div>
      </div>
    </section>
  );
}
