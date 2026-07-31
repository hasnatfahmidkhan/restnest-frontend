"use client";

import DotField from "@/components/DotField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Home, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Counter } from "./Counter";

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (category && category !== "all")
      params.set("category", category.toLowerCase());

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* ReactBits DotField Background */}
      <div className="absolute inset-0 z-0 opacity-80 dark:opacity-60">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#A855F7"
          gradientTo="#B497CF"
          // glowColor="#120F17"
          glowColor="#D1D5DB"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-border bg-background/60 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            #1 Trusted Real Estate Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-foreground mb-6"
        >
          Find Your Next Home,
          <br />
          <span className="bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Effortlessly.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12"
        >
          Discover verified properties, connect with trusted landlords, and
          manage your rentals all in one place. Your journey to the perfect home
          starts here.
        </motion.p>

        {/* Glassmorphism Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto p-3 bg-background/70 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-3"
        >
          {/* City Input */}
          <div className="relative flex-1 w-full md:w-auto">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Enter city (e.g., Dhaka)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-border" />

          {/* Category Select (Using 6 items from your API) */}
          <div className="relative flex-1 w-full md:w-auto">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-12 pl-12 bg-muted/50 border-0 rounded-xl focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="family house">Family House</SelectItem>
                <SelectItem value="bachelor room">Bachelor Room</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="mess">Mess</SelectItem>
                <SelectItem value="sublet">Sublet</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto h-12 px-8 rounded-xl group"
          >
            <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Search
          </Button>
        </motion.form>

        {/* Quick Stats Trust Bar (With Animated Counters) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              <Counter value={500} suffix="+" />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Verified Properties
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              <Counter value={10000} suffix="+" />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Happy Tenants</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              <Counter value={5000} suffix="+" />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Trusted Landlords
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              <Counter value={12} />
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Cities Covered</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
