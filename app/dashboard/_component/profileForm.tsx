"use client";

import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { updateProfile } from "@/services/profile.service";
import { Loader2, Upload } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 characters.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { uploadImage, isUploading } = useCloudinaryUpload();
  const [isPending, startTransition] = useTransition();

  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 1. Store only the local temporary preview string
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // 2. Compute final image preview instantly during render (Zero useEffects)
  const preview = localPreview || user?.profile?.profilePhoto || null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      bio: user?.profile?.bio || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setSelectedFile(file);

    // Revoke previous local object URL to avoid browser memory leaks
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setLocalPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    setFileError(null);
    let profilePhotoUrl = user?.profile?.profilePhoto || "";

    if (selectedFile) {
      const imageUrl = await uploadImage(selectedFile);

      if (!imageUrl) {
        setFileError("Image upload failed. Please try again.");
        return;
      }

      profilePhotoUrl = imageUrl;
    }

    const payload = {
      ...data,
      profilePhoto: profilePhotoUrl,
    };

    startTransition(async () => {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));

      const result = await updateProfile(formData);

      if (result.success && result.user) {
        setUser(result.user);
        toast.success(result.message || "Profile updated successfully!");

        // Clean up preview strings upon successful form submission
        if (localPreview) {
          URL.revokeObjectURL(localPreview);
        }
        setSelectedFile(null);
        setLocalPreview(null);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    });
  };

  const isDisabled = isPending || isUploading;

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20 border">
          {preview ? (
            <AvatarImage src={preview} alt={user?.name || "User"} />
          ) : (
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {user?.name?.charAt(0).toUpperCase() ||
                user?.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-2xl font-heading">My Profile</CardTitle>
          <CardDescription>
            View and update your personal information.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="flex items-center gap-4">
            <Label
              htmlFor="profile-photo"
              className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Change Photo"}
            </Label>
            <Input
              id="profile-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isDisabled}
            />
            {fileError && (
              <p className="text-sm text-destructive">{fileError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Not set"
                disabled={isDisabled}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                readOnly
                className="bg-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Not set"
                disabled={isDisabled}
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Input
                id="role"
                defaultValue={user?.role || ""}
                readOnly
                className="bg-muted/50 capitalize"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Tell us a little about yourself..."
              disabled={isDisabled}
              {...form.register("bio")}
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-destructive">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isDisabled}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
