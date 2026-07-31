import { Container } from "@/components/shared/container";
import { CreditCard, ShieldCheck, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Listings",
      desc: "Every property and landlord is thoroughly verified to ensure 100% authenticity and safety.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      desc: "Integrated with Stripe & SSLCommerz for seamless, transparent, and secure rental payments.",
    },
    {
      icon: Zap,
      title: "Seamless Process",
      desc: "From browsing to booking, manage your entire rental journey within our intuitive dashboard.",
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden bg-secondary/30">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <Container className="relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Why Choose RestNest?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine technology and trust to give you the best rental
            experience possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feat, i) => (
            <div
              key={i}
              className="relative p-8 rounded-2xl bg-background/40 backdrop-blur-xl border border-border/50 shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <feat.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                {feat.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
