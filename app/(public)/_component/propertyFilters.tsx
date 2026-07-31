// components/property-filters.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAmenities, useCategories } from "@/hooks/useProperties";

export default function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: amenitiesData, isLoading: amenitiesLoading } = useAmenities();

  const selectedAmenities = searchParams.getAll("amenity");

  const updateFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page on filter change
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const toggleAmenity = (amenityName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("amenity");
    
    params.delete("amenity");
    
    const newAmenities = current.includes(amenityName)
      ? current.filter((a) => a !== amenityName)
      : [...current, amenityName];
      
    newAmenities.forEach((a) => params.append("amenity", a));
    params.delete("page");
    
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-2 text-lg font-heading font-semibold text-foreground">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        Filters
      </div>

      {/* Search Term */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Title, address..."
            defaultValue={searchParams.get("searchTerm") || ""}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="e.g. Dhaka"
          defaultValue={searchParams.get("city") || ""}
          onChange={(e) => updateFilter("city", e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        {categoriesLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            defaultValue={searchParams.get("category") || "all"}
            onValueChange={(val) => updateFilter("category", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesData?.data.map((cat) => (
                <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            defaultValue={searchParams.get("minPrice") || ""}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="5000"
            defaultValue={searchParams.get("maxPrice") || ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <Label>Amenities</Label>
        {amenitiesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {amenitiesData?.data.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={selectedAmenities.includes(amenity.name.toLowerCase())}
                  onCheckedChange={() => toggleAmenity(amenity.name.toLowerCase())}
                />
                <Label
                  htmlFor={`amenity-${amenity.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => router.push(pathname)}
        disabled={isPending}
      >
        Clear All Filters
      </Button>
    </div>
  );
}