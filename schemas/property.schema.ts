import { z } from "zod";

export const propertyFilterSchema = z.object({
  searchTerm: z.string().optional().catch(undefined),
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(10),
  sortBy: z
    .enum(["createdAt", "rentPrice", "averageRating"])
    .catch("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).catch("desc"),
  city: z.string().optional().catch(undefined),
  division: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  minPrice: z.coerce.number().optional().catch(undefined),
  maxPrice: z.coerce.number().optional().catch(undefined),
  amenity: z.array(z.string()).optional().catch([]),
});

export type PropertyFilterValues = z.infer<typeof propertyFilterSchema>;

export type PropertyImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export type PropertyAmenity = {
  amenity: {
    name: string;
    id: string;
  };
};

export type Property = {
  id: string;
  title: string;
  description: string;
  rentPrice: string;
  address: string;
  city: string;
  division: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isAvailable: boolean;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  propertyAmenities: PropertyAmenity[];
  propertyImages: PropertyImage[];
};

export type Pagination = {
  total: number;
  pageNumber: number;
  limit: number;
  totalPage: number;
};

export type PropertyResponse = {
  success: boolean;
  message: string;
  data: {
    properties: Property[];
    pagination: Pagination;
  };
};

export type SelectableItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SelectableResponse = {
  success: boolean;
  message: string;
  data: SelectableItem[];
};

export type SinglePropertyResponse = {
  success: boolean;
  message: string;
  data: {
    property: Property;
    recommendedProperties: Property[];
  };
};
