"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Subscribed successfully!");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          Get the Latest Updates
        </h2>
        <p className="text-muted-foreground mb-8">
          Subscribe to our newsletter to receive the newest property listings
          and platform updates right in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <div className="relative flex items-center bg-background border border-border rounded-full overflow-hidden p-1 shadow-sm">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-transparent px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full px-6"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>

            {/* Border Beam Effect */}
            <div className="absolute inset-0 rounded-full pointer-events-none border-2 border-transparent [mask-image:linear-gradient(white,transparent)] [animation:border-beam_3s_infinite]" />
          </div>
        </form>
      </div>
    </section>
  );
}
