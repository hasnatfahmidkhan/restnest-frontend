"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce"; // Import debounce

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
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import DeleteDialog from "@/components/shared/DeleteDialog";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/schemas/property.schema";
import { useAuthStore } from "@/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { deleteProperty } from "../../_actions/property.actions";

export default function PropertiesTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const filters = {
    landlordId: user?.id,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 5,
    searchTerm: searchParams.get("searchTerm") || "",
    sortBy:
      (searchParams.get("sortBy") as
        | "createdAt"
        | "rentPrice"
        | "averageRating") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  const { data, isPending, isError } = useProperties(filters);
  const properties = data?.data.properties || [];
  const pagination = data?.data.pagination;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  // DEBOUNCE: Wrapped the search function with useDebouncedCallback (500ms delay)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("searchTerm", term);
    } else {
      params.delete("searchTerm");
    }
    params.delete("page"); // Reset to page 1 on new search
    router.push(`${pathname}?${params.toString()}`);
  }, 500);

  // Handle Sort changes
  const handleSortChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete("page"); // Reset to page 1 on sort change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls Area */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            defaultValue={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)} // Call debounced function
          />
        </div>

        {/* Sort & Create Button */}
        <div className="flex items-center gap-3">
          <Select
            defaultValue={filters.sortBy}
            onValueChange={(val) => handleSortChange("sortBy", val)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="rentPrice">Rent Price</SelectItem>
              <SelectItem value="averageRating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={filters.sortOrder}
            onValueChange={(val) => handleSortChange("sortOrder", val)}
          >
            <SelectTrigger className="w-27.5">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/dashboard/landlord/properties/create">
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Create Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Area */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Property Details</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => (
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
                  No properties found. Click &quot;Create Property&quot; to add
                  one.
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
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/landlord/properties/${property.id}/edit`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(property)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.pageNumber} of {pagination.totalPage}
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

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        itemData={selectedProperty}
        itemName={selectedProperty?.title}
        entityType="Property"
        onDeleteAction={deleteProperty} // Pass the server action
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["properties"] })
        }
      />
    </div>
  );
}
