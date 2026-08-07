"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Frown, Home, RotateCw, ServerCrash } from "lucide-react";
import Link from "next/link";

interface ErrorDisplayProps {
  errorCode: string;
  title: string;
  description: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function ErrorDisplay({
  errorCode,
  title,
  description,
  showRetry = false,
  onRetry,
}: ErrorDisplayProps) {
  const Icon = errorCode === "404" ? Frown : ServerCrash;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(var(--primary) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Giant Translucent Error Code Background */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute pointer-events-none select-none text-[20rem] md:text-[30rem] font-heading font-black text-foreground z-0"
      >
        {errorCode}
      </motion.h1>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 mb-8"
        >
          <Icon className="w-10 h-10 text-destructive" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md mx-auto text-muted-foreground mb-8"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {showRetry && (
            <Button onClick={onRetry} size="lg" variant="default">
              <RotateCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          )}
          <Link href="/">
            <Button size="lg" variant={showRetry ? "outline" : "default"}>
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
