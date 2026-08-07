import { Container } from "@/components/shared/container";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Listings",
      desc: "Find properties with confidence through a platform designed to promote authentic listings and trustworthy landlords.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      desc: "Complete your rental payments through a secure and reliable payment experience powered by Stripe.",
    },
    {
      icon: Zap,
      title: "Seamless Process",
      desc: "From discovering a property to submitting a rental request and completing payment, everything stays in one place.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 z-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Why Choose RestNest
          </div>

          <h2 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            A Better Way to <span className="text-primary">Find Your Home</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Renting a home shouldn&apos;t be complicated. RestNest brings
            properties, rental requests, landlords, and payments together to
            make your entire rental journey simpler and more transparent.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center rounded-2xl border border-border/50 bg-background/40 p-8 text-center shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                <feat.icon className="h-7 w-7 text-primary" />
              </div>

              <h3 className="mb-2 font-heading text-xl font-semibold">
                {feat.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust / Platform Highlights */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 divide-y divide-border rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="flex items-center justify-center gap-3 p-6">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Trusted Experience</p>
              <p className="text-sm text-muted-foreground">
                Built with security in mind
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-6">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">For Tenants & Landlords</p>
              <p className="text-sm text-muted-foreground">
                One platform for everyone
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-6">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Simple & Efficient</p>
              <p className="text-sm text-muted-foreground">
                Less hassle, better experience
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="mb-4 text-muted-foreground">
            Ready to find a place that feels like home?
          </p>

          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:gap-3"
          >
            Explore More It
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
