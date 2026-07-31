import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rahim Uddin",
    role: "Tenant",
    text: "Found my bachelor mess in Dhaka within 2 days! The process was incredibly smooth and verified.",
    rating: 5,
  },
  {
    name: "Sarah Khan",
    role: "Landlord",
    text: "RestNest helped me rent out my apartment without any hassle. The dashboard makes managing requests so easy.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Tenant",
    text: "The secure payment system gave me peace of mind. Highly recommend this platform to anyone looking for rent.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Tenant",
    text: "I loved how I could filter properties by amenities. Found the perfect sublet with WiFi and AC instantly.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Loved by Thousands
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Don&apos;t just take our word for it. Here&apos;s what our community
          has to say.
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-6 animate-marquee hover:paused">
          {[...reviews, ...reviews, ...reviews].map((review, i) => (
            <div
              key={i}
              className="w-87.5 shrink-0 bg-card border border-border rounded-2xl p-6 text-left shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &quot;{review.text}&quot;
              </p>
              <div>
                <h4 className="font-semibold text-foreground">{review.name}</h4>
                <p className="text-sm text-primary">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
