"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function LandlordCTA() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <section className="relative py-20 md:py-28 bg-secondary text-secondary-foreground overflow-hidden">
      {/* Dot Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-heading font-bold mb-4"
        >
          Have a property to rent out?
        </motion.h2>
        <p className="max-w-2xl mx-auto text-secondary-foreground/80 mb-10">
          List your property in minutes and reach thousands of verified tenants.
          Manage requests, approvals, and payments all in one place.
        </p>

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="inline-block"
        >
          <Link
            ref={btnRef}
            href="/dashboard/landlord/properties"
            className="relative inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-lg transition-colors hover:bg-primary/90"
            style={{ transition: "transform 0.2s ease-out" }}
          >
            List Your Property <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
