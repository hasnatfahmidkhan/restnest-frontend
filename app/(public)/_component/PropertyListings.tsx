"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProperties } from "@/hooks/useProperties";
import { propertyFilterSchema } from "@/schemas/property.schema";
import {
  Bath,
  BedDouble,
  ImageOff,
  MapPin,
  Maximize,
  RotateCw,
  ServerCrash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ListingsSkeleton } from "./FiltersSkeleton";

export default function PropertyListings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Safely extract amenity array before parsing
  const rawParams: Record<string, string | string[]> = Object.fromEntries(
    searchParams.entries(),
  );
  rawParams.amenity = searchParams.getAll("amenity");

  // Validate and parse search params with Zod
  const filters = propertyFilterSchema.parse(rawParams);

  // Renaming isLoading to isPending as requested
  const { data, isPending, isError, refetch } = useProperties(filters);

  // Show skeleton immediately when isPending is true
  if (isPending) return <ListingsSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl text-center bg-card">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <ServerCrash className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Failed to Load Properties
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          We couldn&apos;t fetch the properties due to a network or server
          issue. Please check your connection and try again.
        </p>
        <Button onClick={() => refetch()} className="gap-2">
          <RotateCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const properties = data?.data.properties || [];
  const pagination = data?.data.pagination;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Limit Selector */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {properties.length} of {pagination?.total || 0} properties
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <select
            className="bg-background border border-input rounded-md p-1 text-sm"
            value={filters.limit}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("limit", e.target.value);
              params.delete("page"); // Reset page
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl">
          <p className="text-lg font-medium text-foreground">
            No properties found
          </p>
          <p className="text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => {
            // Find primary image, fallback to first image, fallback to null
            const primaryImage =
              property.propertyImages?.find((img) => img.isPrimary) ||
              property.propertyImages?.[0];

            return (
              // Wrapped Card in Link for navigation
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group block h-full" // 'group' allows child hover effects
              >
                <Card className="overflow-hidden h-full flex flex-col p-0 border-border/80 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary/30">
                  {/* Image Section */}
                  <div className="relative w-full h-52 bg-muted overflow-hidden">
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
                    {/* Availability Badge over image */}
                    <Badge
                      className={`absolute top-3 right-3 ${
                        property.isAvailable
                          ? "bg-primary/90"
                          : "bg-destructive/90"
                      }`}
                    >
                      {property.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  {/* Content Section */}
                  <CardHeader className="flex-row items-start justify-between space-y-0 p-4 pb-2">
                    <div>
                      {/* Micro-interaction: Title changes color on hover */}
                      <CardTitle className="text-lg font-heading mb-1 transition-colors duration-300 group-hover:text-primary">
                        {property.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <MapPin className="w-3 h-3" /> {property.address},{" "}
                        {property.city}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="grow flex flex-col justify-between p-4 pt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {property.description}
                    </p>

                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center justify-between text-sm border-t pt-4">
                        <div className="flex gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4" />{" "}
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> {property.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" /> {property.area}{" "}
                            sqft
                          </span>
                        </div>
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
                        {/* Micro-interaction: Button changes style on hover */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground hover:bg-primary cursor-pointer"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber <= 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={
                    page === pagination.pageNumber ? "default" : "outline"
                  }
                  size="sm"
                  className="w-9"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber >= pagination.totalPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
