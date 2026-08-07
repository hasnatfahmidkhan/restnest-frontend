"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Home,
  LifeBuoy,
  Search,
  SearchX,
  UserCog,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  {
    icon: UserCog,
    title: "Account & Security",
    desc: "Passwords, profiles, and account settings.",
  },
  {
    icon: Home,
    title: "Property Listings",
    desc: "Adding, editing, or finding properties.",
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    desc: "Stripe, SSLCommerz, and transaction issues.",
  },
  {
    icon: LifeBuoy,
    title: "Rental Process",
    desc: "Requests, approvals, leases, and cancellations.",
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Click on the 'Forgot password' link on the login page. Enter your registered email address, and we will send you a link to securely reset your password.",
  },
  {
    question: "How do I pay my rent?",
    answer:
      "Once your rental request is approved by the landlord, go to your Tenant Dashboard > My Rentals. Find the approved rental and click the 'Pay Now' button. You will be securely redirected to Stripe or SSLCommerz to complete your payment.",
  },
  {
    question: "How long does it take for a landlord to approve my request?",
    answer:
      "Approval times vary by landlord. You will receive a notification and see the status update in your dashboard as soon as a decision is made. You can also track the status under 'My Rentals'.",
  },
  {
    question: "Can I cancel a rental request?",
    answer:
      "Yes. If your request is still 'Pending' or 'Approved' (but not yet paid for), you can cancel it by going to your Tenant Dashboard and clicking the 'Cancel' button next to the request.",
  },
  {
    question: "How do I list my property as a landlord?",
    answer:
      "Log in as a landlord, go to your Dashboard, and click 'Create Property'. Fill in the property details, upload high-quality images, select amenities, and set your rent price. Your property will be live instantly.",
  },
  {
    question: "What happens if my payment fails?",
    answer:
      "If your payment fails, your rental status will remain 'Approved' and you will not be charged. You can attempt the payment again from your dashboard using a different card or payment method.",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerCaseQuery) ||
        faq.answer.toLowerCase().includes(lowerCaseQuery),
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(var(--primary) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              How can we help you?
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Search our knowledge base or browse categories to find quick
              answers to your questions.
            </p>

            {/* Workable Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for articles, e.g., 'How do I pay rent'"
                className="h-14 pl-12 pr-12 text-lg rounded-full shadow-sm focus-visible:ring-primary"
              />
              {/* Clear Button (Industry Standard UX) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid (Hidden when searching to focus on results) */}
      {!searchQuery && (
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="group h-full p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <cat.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* FAQs Section (Dynamically Filtered) */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-2">
            {searchQuery ? "Search Results" : "Frequently Asked Questions"}
          </h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Found ${filteredFaqs.length} result(s) for "${searchQuery}"`
              : "Find quick answers to the most common questions."}
          </p>
        </div>

        {filteredFaqs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <AccordionItem value={`item-${i}`} className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/30 transition-colors text-base font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </motion.div>
        ) : (
          // No Results Empty State
          <div className="text-center py-16 border border-dashed rounded-2xl">
            <SearchX className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No matching questions found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              We couldn&apos;t find anything related to your search. Try
              different keywords or contact our support team.
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="mr-2"
            >
              Clear Search
            </Button>
            <Link href="/contact">
              <Button>
                Contact Support <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section (Hidden when searching) */}
      {!searchQuery && (
        <section className="container mx-auto px-4 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-secondary text-secondary-foreground p-12 text-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
                Still need help?
              </h2>
              <p className="max-w-md mx-auto text-secondary-foreground/80 mb-6">
                Can&apos;t find the answer you are looking for? Our support team
                is just a message away.
              </p>
              <Link href="/contact">
                <Button size="lg" className="rounded-full">
                  Contact Support <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
