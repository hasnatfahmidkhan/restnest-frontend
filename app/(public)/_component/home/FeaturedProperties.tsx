"use client";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/schemas/property.schema";
import { motion } from "framer-motion";
import { ArrowRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedProperties({
  properties,
}: {
  properties: Property[];
}) {
  if (!properties || properties.length === 0) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <Container className="py-20 md:py-28">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2"
          >
            Featured Properties
          </motion.h2>
          <p className="text-muted-foreground">
            Handpicked premium listings just for you.
          </p>
        </div>
        <Link
          href="/properties"
          className="text-primary hover:underline flex items-center gap-1 font-medium"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property, i) => {
          const primaryImage =
            property.propertyImages?.find((img) => img.isPrimary) ||
            property.propertyImages?.[0];
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseMove={handleMouseMove}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border transition-shadow hover:shadow-xl"
            >
              {/* Spotlight Overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background:
                    "radial-gradient(400px circle at var(--x) var(--y), rgba(59, 130, 246, 0.15), transparent 40%)",
                }}
              />

              <Link href={`/properties/${property.id}`} className="block">
                <div className="relative h-60 bg-muted overflow-hidden">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fill
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4 bg-primary/90">
                    {property.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </Link>

              <div className="p-6 relative z-20">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground gap-1 mb-4">
                  <MapPin className="w-4 h-4" /> {property.address},{" "}
                  {property.city}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" /> {property.area} sqft
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ${property.rentPrice}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                  {/* BorderBeam Button */}
                  <Link href={`/properties/${property.id}`}>
                    <button className="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-105">
                      View Details
                      <span className="absolute inset-0 rounded-md border-2 border-primary-foreground/50 mask-[linear-gradient(white,transparent)] animate-[border-beam_2s_infinite]" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}
