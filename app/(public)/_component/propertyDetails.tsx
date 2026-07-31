// components/property-details.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProperty } from "@/hooks/useProperty";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  ImageOff,
  MapPin,
  Maximize,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PropertyDetailsSkeleton from "./propertyDetailsSkeleton";
import RentRequestDialog from "./rentRequestDialog";

export default function PropertyDetails({ id }: { id: string }) {
  const { data, isPending, isError } = useProperty(id);

  if (isPending) return <PropertyDetailsSkeleton />;

  if (isError || !data?.success) {
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

  const property = data.data;

  // Handle empty image arrays gracefully
  const hasImages =
    property.propertyImages && property.propertyImages.length > 0;
  const primaryImage = hasImages
    ? property.propertyImages.find((img) => img.isPrimary) ||
      property.propertyImages[0]
    : null;
  const galleryImages = hasImages
    ? property.propertyImages
        .filter((img) => img.id !== primaryImage?.id)
        .slice(0, 4)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          {/* Image Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-3 h-125">
            {hasImages ? (
              <>
                {/* Main Image */}
                <div className="col-span-4 md:col-span-2 row-span-2 rounded-xl overflow-hidden relative group">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <ImageOff className="w-10 h-10" />
                      <span className="text-xs">No image available</span>
                    </div>
                  )}
                </div>
                {/* Gallery Images */}
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="hidden md:block rounded-xl overflow-hidden relative group"
                  >
                    <Image
                      src={img.url}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                    />
                  </div>
                ))}
                {/* Fallbacks for grid layout if less than 4 gallery images */}
                {Array.from({
                  length: Math.max(0, 4 - galleryImages.length),
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="hidden md:block rounded-xl bg-muted border border-dashed"
                  />
                ))}
              </>
            ) : (
              <div className="col-span-4 row-span-2 rounded-xl bg-muted border border-dashed flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImageOff className="w-12 h-12" />
                <span>No images provided for this property</span>
              </div>
            )}
          </div>

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

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold">
              About this property
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
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

        {/* Right Column: Pricing & Rent Request */}
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
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">
                    Interested in this place?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submit a rent request to the landlord to initiate the
                    booking process for this property.
                  </p>

                  {/* Replace the old Button with this Dialog Component */}
                  <RentRequestDialog propertyId={property.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
