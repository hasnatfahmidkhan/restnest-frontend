import {
  BadgeCheck,
  CreditCard,
  Headset,
  MapPinned,
  ShieldCheck,
  Zap,
} from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, text: "100% Verified Landlords" },
  { icon: CreditCard, text: "Secure SSLCommerz & Stripe Payments" },
  { icon: Zap, text: "Instant Rent Request Processing" },
  { icon: BadgeCheck, text: "Authentic Property Images" },
  { icon: Headset, text: "Dedicated 24/7 Customer Support" },
  { icon: MapPinned, text: "Premium Locations Across Bangladesh" },
];

export default function TrustBar() {
  const items = [...trustItems, ...trustItems]; // Duplicate for seamless loop

  return (
    <section className="relative w-full border-y border-border bg-muted/30 py-6 overflow-hidden">
      {/* Edge Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

      {/* CSS Marquee Animation */}
      <div className="flex gap-12 whitespace-nowrap animate-marquee">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 shrink-0">
            <item.icon className="w-5 h-5 text-primary" />
            <span className="text-sm md:text-base font-medium text-foreground/80 tracking-wide">
              {item.text}
            </span>
            <span className="text-primary/40 text-2xl leading-none ml-12">
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
