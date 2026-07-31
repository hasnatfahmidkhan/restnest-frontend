import { CreditCard, KeyRound, Search } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "1. Search & Filter",
      desc: "Browse hundreds of verified properties and filter by location, price, and amenities to find your match.",
    },
    {
      icon: KeyRound,
      title: "2. Request & Approve",
      desc: "Submit a rent request with your details. The landlord reviews and approves your application instantly.",
    },
    {
      icon: CreditCard,
      title: "3. Pay & Move In",
      desc: "Securely pay your rent via SSLCommerz or Stripe, get your confirmation, and move into your new home.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Renting a home has never been easier. Follow these three simple steps.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="sticky top-24 bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-start gap-6"
          >
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <step.icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
