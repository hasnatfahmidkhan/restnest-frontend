// components/home/categories-section.tsx
"use client";

import { Container } from "@/components/shared/container";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Home,
  Hotel,
  Layers,
  LucideIcon,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Define the prop type
type Category = {
  id: string;
  name: string;
};

const getIcon = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("family")) return Home;
  if (lowerName.includes("bachelor") || lowerName.includes("mess"))
    return Users;
  if (lowerName.includes("apartment") || lowerName.includes("flat"))
    return Building2;
  if (lowerName.includes("villa") || lowerName.includes("duplex"))
    return Sparkles;
  if (lowerName.includes("sublet")) return Layers;
  if (lowerName.includes("office")) return Briefcase;
  if (lowerName.includes("shop")) return Store;
  if (lowerName.includes("studio")) return Hotel;
  return Building2;
};

export default function CategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  // Show exactly 8 items for a clean grid
  const displayCategories = categories.toReversed().slice(0, 8);

  const handleCategoryClick = (categoryName: string) => {
    router.push(
      `/properties?category=${encodeURIComponent(categoryName.toLowerCase())}`,
    );
  };

  return (
    <Container className="py-20 md:py-28">
      {/* Header */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3"
        >
          Browse by Category
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Find exactly what you&apos;re looking for. Choose from our diverse
          range of property types tailored to your needs.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-6">
        {displayCategories.map((category, index) => {
          const Icon = getIcon(category.name);

          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col items-center justify-center gap-4 p-8 border border-border rounded-2xl bg-card hover:border-primary/30 transition-colors duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="relative z-10 font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h3>
            </motion.button>
          );
        })}
      </div>
    </Container>
  );
}
