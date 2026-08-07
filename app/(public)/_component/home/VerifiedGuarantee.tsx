"use client";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  CheckCircle2,
  Home,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const verificationSteps = [
  {
    title: "Government ID Verification",
    desc: "Every landlord must submit verified government-issued identification to list a property.",
  },
  {
    title: "Property Documents Checked",
    desc: "We verify ownership documents and utility bills to ensure the listing is 100% legitimate.",
  },
  {
    title: "Real-Time Availability Tracking",
    desc: "Our system updates availability instantly, so you never waste time on a property that's already gone.",
  },
];

export default function VerifiedGuarantee() {
  return (
    <Container className="py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Copy & Checklist */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="secondary"
            className="mb-4 py-1 px-3 text-xs font-semibold"
          >
            Verified Listing Guarantee
          </Badge>

          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 leading-tight">
            Zero Fake Listings. <br />
            <span className="text-primary">100% Verified.</span>
          </h2>

          <p className="text-muted-foreground mb-8 max-w-md">
            We know how frustrating it is to deal with scams. That&apos;s why we
            rigorously verify every property and landlord on our platform before
            it goes live.
          </p>

          <div className="space-y-6">
            {verificationSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Interactive Property Card Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Glow Background */}
          <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-purple-500/10 to-accent/20 rounded-full blur-3xl opacity-60" />

          {/* The Mock Card */}
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Image Area */}
            <div className="relative h-48 bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-accent/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Home className="w-20 h-20 text-white/30" />
              </div>

              {/* The Verified Stamp Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                whileInView={{ scale: 1, rotate: -12, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                  delay: 0.6,
                }}
                className="absolute top-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 backdrop-blur-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Verified
              </motion.div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-4">
              <div>
                <div className="h-5 w-3/4 bg-foreground/80 rounded mb-2" />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BedDouble className="w-4 h-4" />
                  <div className="h-3 w-6 bg-muted rounded" />
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Bath className="w-4 h-4" />
                  <div className="h-3 w-6 bg-muted rounded" />
                </div>
              </div>

              <div className="flex items-end justify-between pt-2 border-t">
                <div className="h-6 w-16 bg-primary/50 rounded" />
                <div className="h-8 w-20 bg-primary rounded-lg" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
