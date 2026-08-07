"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PopularLocation } from "../../_actions/home";

// Image mapping for known cities. Falls back to a generic luxury home image.
export const cityImages: Record<string, string> = {
  Dhaka:
    "https://res.cloudinary.com/dye6u4hpt/image/upload/v1786124655/images_5_z3jafq.jpg",
  Chittagong:
    "https://res.cloudinary.com/dye6u4hpt/image/upload/v1786125293/1615872938366_elfusn.jpg",
  Sylhet:
    "https://res.cloudinary.com/dye6u4hpt/image/upload/v1786125348/Sylhet_city_02_guj4x5.jpg",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070";

interface PopularLocationsProps {
  locations: PopularLocation[];
}

export default function PopularLocations({ locations }: PopularLocationsProps) {
  const router = useRouter();

  // Fallback if the API returns an empty array
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Popular Locations
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore premium properties in the most sought-after cities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {locations.map((city, i) => {
          const image = cityImages[city.location] || fallbackImage;

          return (
            <motion.div
              key={city.location}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() =>
                router.push(`/properties?city=${city.location.toLowerCase()}`)
              }
              className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <Image
                fill
                src={image}
                alt={`Properties in ${city.location}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-3xl font-heading font-bold bg-linear-to-r from-primary to-primary-foreground bg-clip-text text-transparent drop-shadow-sm">
                  {city.location}
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {city.propertyCount}{" "}
                  {city.propertyCount === 1 ? "Property" : "Properties"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
