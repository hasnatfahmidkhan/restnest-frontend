"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminProperties } from "@/hooks/useAdminProperties";
import { ChevronLeft, ChevronRight, ExternalLink, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function AdminPropertiesTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    sortBy:
      (searchParams.get("sortBy") as
        | "createdAt"
        | "rentPrice"
        | "averageRating") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    searchTerm: searchParams.get("searchTerm") || "",
    availability:
      searchParams.get("availability") === "true"
        ? true
        : searchParams.get("availability") === "false"
          ? false
          : undefined,
  };

  const { data, isPending, isError } = useAdminProperties(filters);
  const properties = data?.data.properties || [];
  const pagination = data?.data.pagination;

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateQuery("searchTerm", term);
  }, 500);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            defaultValue={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select
            defaultValue={
              filters.availability === undefined
                ? "all"
                : String(filters.availability)
            }
            onValueChange={(val) => updateQuery("availability", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.sortBy}
            onValueChange={(val) => updateQuery("sortBy", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="rentPrice">Rent Price</SelectItem>
              <SelectItem value="averageRating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.sortOrder}
            onValueChange={(val) => updateQuery("sortOrder", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Property Details</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-destructive py-8"
                >
                  Failed to load properties.
                </TableCell>
              </TableRow>
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12"
                >
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md bg-muted overflow-hidden shrink-0">
                        {property.propertyImages?.[0] && (
                          <Image
                            fill
                            src={property.propertyImages[0].url}
                            alt={property.title}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {property.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.bedrooms} Bed | {property.bathrooms} Bath |{" "}
                          {property.area} sqft
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {property.city}, {property.division}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${property.rentPrice}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={property.isAvailable ? "default" : "destructive"}
                    >
                      {property.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/properties/${property.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.pageNumber} of {pagination.totalPage} (Total:{" "}
            {pagination.total} properties)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPage}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
