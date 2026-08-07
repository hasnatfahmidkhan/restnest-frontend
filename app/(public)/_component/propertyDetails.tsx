// components/property-details.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProperty } from "@/hooks/useProperty";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  MapPin,
  Maximize,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PropertyDetailsSkeleton from "./propertyDetailsSkeleton";
import RentRequestDialog from "./rentRequestDialog";

export default function PropertyDetails({ id }: { id: string }) {
  const { data, isPending, isError } = useProperty(id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isPending) return <PropertyDetailsSkeleton />;

  if (isError || !data?.success || !data?.data?.property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Property not found
        </h1>
        <p className="text-muted-foreground mb-6">
          The property you are looking for does not exist or failed to load.
        </p>
        <Link href="/properties">
          <Button variant="outline">Back to Properties</Button>
        </Link>
      </div>
    );
  }

  const { property, recommendedProperties } = data.data;

  const hasImages =
    property.propertyImages && property.propertyImages.length > 0;
  const allImages = hasImages ? property.propertyImages : [];

  // Lightbox navigation handlers
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % allImages.length : null,
    );
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + allImages.length) % allImages.length : null,
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb / Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Airbnb-Style Image Gallery */}
          {hasImages ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-75 md:h-125 rounded-2xl overflow-hidden">
              {/* Main Large Image (Left) */}
              <div
                className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
                onClick={() => setLightboxIndex(0)}
              >
                <Image
                  src={allImages[0].url}
                  alt={property.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Secondary Images (Right 2x2 Grid) */}
              {allImages.slice(1, 5).map((img, idx) => (
                <div
                  key={img.id}
                  className="hidden md:block relative group cursor-pointer overflow-hidden"
                  onClick={() => setLightboxIndex(idx + 1)}
                >
                  <Image
                    src={img.url}
                    alt={`${property.title} ${idx + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Show "View All" overlay on the 4th image if there are more than 5 */}
                  {idx === 3 && allImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{allImages.length - 5} More
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Fallback placeholders if less than 5 images */}
              {Array.from({
                length: Math.max(0, 4 - (allImages.length - 1)),
              }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="hidden md:block bg-muted border border-dashed rounded-md"
                />
              ))}
            </div>
          ) : (
            <div className="h-75 md:h-125 flex flex-col items-center justify-center rounded-2xl bg-muted border border-dashed  text-muted-foreground gap-2">
              <ImageOff className="w-12 h-12" />
              <span>No images provided for this property</span>
            </div>
          )}

          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-muted-foreground gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {property.address}, {property.city}, {property.division}
                  </span>
                </div>
              </div>
              <Badge
                variant={property.isAvailable ? "default" : "destructive"}
                className="text-sm py-1 px-3"
              >
                {property.isAvailable
                  ? "Available Now"
                  : "Currently Unavailable"}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <BedDouble className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xl font-bold">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">
                    Bedrooms
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Bath className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xl font-bold">
                    {property.bathrooms}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Bathrooms
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Maximize className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xl font-bold">{property.area}</span>
                  <span className="text-xs text-muted-foreground">Sq Ft</span>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Description & Amenities (Same as before) */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold">
              About this property
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.propertyAmenities &&
            property.propertyAmenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-heading font-semibold">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.propertyAmenities.map((item, idx) => (
                    <Badge
                      key={item.amenity.id || idx}
                      variant="secondary"
                      className="capitalize text-sm py-2 px-4"
                    >
                      {item.amenity.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Right Column: Pricing & Rent Request (Same as before) */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                ${property.rentPrice}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span className="font-medium truncate ml-4">
                    {property.id.substring(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> Listed On:
                  </span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  Interested in this place?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Submit a rent request to the landlord to initiate the booking
                  process for this property.
                </p>
                <RentRequestDialog propertyId={property.id} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Properties Section (Same as before) */}
      {recommendedProperties && recommendedProperties.length > 0 && (
        <div className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
            Recommended Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProperties.map((rec) => {
              const recPrimaryImage =
                rec.propertyImages?.find((img) => img.isPrimary) ||
                rec.propertyImages?.[0];
              return (
                <Link
                  href={`/properties/${rec.id}`}
                  key={rec.id}
                  className="group block rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 bg-card"
                >
                  <div className="relative h-40 bg-muted overflow-hidden">
                    {recPrimaryImage ? (
                      <Image
                        src={recPrimaryImage.url}
                        alt={rec.title}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 mb-3">
                      <MapPin className="w-3 h-3" /> {rec.city}, {rec.division}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">
                        ${rec.rentPrice}
                        <span className="text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      </span>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3 h-3" /> {rec.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize className="w-3 h-3" /> {rec.area}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Premium Full-Screen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                className="absolute left-6 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image Container */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-5xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[lightboxIndex].url}
                alt={property.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                className="absolute right-6 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
