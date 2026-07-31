"use client";

import { Container } from "@/components/shared/container";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const cities = [
  {
    name: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070",
    count: "500+ Properties",
  },
  {
    name: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1622542084076-23a35977dc28?q=80&w=2070",
    count: "200+ Properties",
  },
  {
    name: "Sylhet",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacde6976549?q=80&w=2070",
    count: "150+ Properties",
  },
];

export default function PopularLocations() {
  const router = useRouter();

  return (
    <Container className="py-20 md:py-28">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Popular Locations
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore premium properties in the most sought-after cities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cities.map((city, i) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() =>
              router.push(`/properties?city=${city.name.toLowerCase()}`)
            }
            className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
          >
            <Image
              src={city.image}
              alt={`Properties in ${city.name}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              fill
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-3xl font-heading font-bold bg-linear-to-r from-primary to-primary-foreground bg-clip-text text-transparent drop-shadow-sm">
                {city.name}
              </h3>
              <p className="text-white/90 text-sm mt-1">{city.count}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
