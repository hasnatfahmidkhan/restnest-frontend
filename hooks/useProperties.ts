import {
  PropertyFilterValues,
  PropertyResponse,
  SelectableResponse,
} from "@/schemas/property.schema";
import {
  getAmenitiesService,
  getCategoriesService,
  getPropertiesService,
} from "@/services/property.service";
import { useQuery } from "@tanstack/react-query";

export const useProperties = (filters: PropertyFilterValues) => {
  return useQuery<PropertyResponse>({
    queryKey: ["properties", filters],
    queryFn: () => getPropertiesService(filters),
  });
};

export const useCategories = () => {
  return useQuery<SelectableResponse>({
    queryKey: ["categories"],
    queryFn: getCategoriesService,
  });
};

export const useAmenities = () => {
  return useQuery<SelectableResponse>({
    queryKey: ["amenities"],
    queryFn: getAmenitiesService,
  });
};
