"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useAmenities, useCategories } from "@/hooks/useProperties";
import { Property } from "@/schemas/property.schema";

import { useSaveProperty } from "@/hooks/useProperty";
import {
  ArrowLeft,
  ImageOff,
  Loader2,
  Save,
  Star,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Removed useEffect
import { toast } from "sonner";
interface PropertyFormProps {
  propertyData?: Property | null;
}

export default function PropertyForm({ propertyData }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!propertyData;
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImage, isUploading } = useCloudinaryUpload();
  const { mutateAsync: savePropertyMutate } = useSaveProperty();

  const { data: categoriesData } = useCategories();
  const { data: amenitiesData } = useAmenities();

  // FIX: Lazy State Initialization (No useEffect needed)
  // This runs only once when the component mounts
  const [formData, setFormData] = useState({
    title: propertyData?.title || "",
    description: propertyData?.description || "",
    rentPrice: propertyData?.rentPrice || "",
    address: propertyData?.address || "",
    city: propertyData?.city || "",
    division: propertyData?.division || "",
    bedrooms: propertyData?.bedrooms || 1,
    bathrooms: propertyData?.bathrooms || 1,
    area: propertyData?.area || 100,
    categoryId: propertyData?.categoryId || "", // Category will now pre-select correctly
    amenityIds: propertyData?.propertyAmenities?.map((a) => a.amenity.id) || [],
  });

  const [imageItems, setImageItems] = useState<
    { url?: string; file?: File; isPrimary: boolean }[]
  >(
    propertyData?.propertyImages?.map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
    })) || [],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter((id) => id !== amenityId)
        : [...prev.amenityIds, amenityId],
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) => ({
        file,
        isPrimary: false,
      }));
      setImageItems((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (idx: number) => {
    setImageItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const setPrimary = (idx: number) => {
    setImageItems((prev) =>
      prev.map((item, i) => ({ ...item, isPrimary: i === idx })),
    );
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.categoryId) return toast.error("Please select a category");
    if (imageItems.length === 0)
      return toast.error("Please upload at least one image");
    if (!imageItems.some((img) => img.isPrimary))
      return toast.error("Please select one primary image");

    setIsLoading(true);

    try {
      const finalImages = [];

      // This logic ensures existing URLs are NOT re-uploaded.
      // Only new files (item.file) are uploaded to Cloudinary.
      for (const item of imageItems) {
        if (item.file) {
          const url = await uploadImage(item.file);
          if (url) {
            finalImages.push({ url, isPrimary: item.isPrimary });
          } else {
            setIsLoading(false);
            return toast.error("Image upload failed. Please try again.");
          }
        } else if (item.url) {
          // Already has a URL from edit mode, just push it directly
          finalImages.push({ url: item.url, isPrimary: item.isPrimary });
        }
      }

      const payload = {
        ...formData,
        rentPrice: Number(formData.rentPrice),
        images: finalImages,
      };

      await savePropertyMutate({
        propertyId: propertyData?.id || null,
        payload,
      });
      toast.success(
        `Property ${propertyData?.id ? "updated" : "created"} successfully!`,
      );
      router.push("/dashboard/landlord/properties");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {isEditMode ? "Edit Property" : "Create New Property"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditMode
              ? "Update the details of your property listing."
              : "Fill in the details to list a new property."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Beautiful Family House"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your property..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentPrice">Rent Price ($)</Label>
                  <Input
                    id="rentPrice"
                    name="rentPrice"
                    type="number"
                    value={formData.rentPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sqft)</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category & Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, categoryId: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.data.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg max-h-48 overflow-y-auto">
                  {amenitiesData?.data.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`amen-${amenity.id}`}
                        checked={formData.amenityIds.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityToggle(amenity.id)}
                      />
                      <Label
                        htmlFor={`amen-${amenity.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Images & Submit */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>
                Upload images and select one as primary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <p className="text-sm">Click to upload images</p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>

              {imageItems.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {imageItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-md overflow-hidden border"
                    >
                      {item.url || item.file ? (
                        <Image
                          src={
                            item.url ??
                            (item.file ? URL.createObjectURL(item.file) : "")
                          }
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover"
                          fill
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-muted">
                          <ImageOff className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setPrimary(idx)}
                        className={`absolute top-1 left-1 p-1 rounded-full ${item.isPrimary ? "bg-primary text-primary-foreground" : "bg-black/50 text-white"}`}
                      >
                        <Star
                          className="w-3 h-3"
                          fill={item.isPrimary ? "currentColor" : "none"}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || isUploading}
          >
            {isLoading || isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploading ? "Uploading Images..." : "Saving Property..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? "Save Changes" : "Create Property"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
