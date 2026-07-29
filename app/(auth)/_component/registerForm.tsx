/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Upload, UserCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRegister } from "@/hooks/auth.hooks";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import Image from "next/image";
import { registerSchema, TRegisterInput } from "../_schemas/auth.schema";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutateAsync, isPending } = useRegister();
  const { uploadImage, isUploading } = useCloudinaryUpload();

  const form = useForm<TRegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "TENANT",
      profilePhoto: "", // Hidden field to store URL
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileError(null);
    setPreview(URL.createObjectURL(file));
    form.setValue("profilePhoto", "temp");
  };

  async function onSubmit(data: TRegisterInput) {
  
    const fileInput = document.getElementById(
      "register-photo",
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setFileError("Please select a profile photo");
      return;
    }

    try {
      // 1. Upload to Cloudinary
      const imageUrl = await uploadImage(file);

      if (!imageUrl) {
        throw new Error("Image upload failed. Please try again.");
      }

      // 2. Submit form with URL
      await mutateAsync({
        ...data,
        profilePhoto: imageUrl,
      });
    } catch (error: any) {
      setFileError(error.message);
    }
  }

  const isDisabled = isPending || isUploading;

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Join RentNest today to find or list properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Profile Photo Upload */}
            <Field>
              <FieldLabel>Profile Photo</FieldLabel>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-input bg-muted">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <UserCircle className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <Label
                  htmlFor="register-photo"
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Label>
                <Input
                  id="register-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e)}
                  disabled={isDisabled}
                />
              </div>
              {fileError && <FieldError errors={[{ message: fileError }]} />}
            </Field>

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    placeholder="john@example.com"
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Role Selection */}
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>I want to register as a...</FieldLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="role-tenant"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-input p-4 hover:bg-accent transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                    >
                      <RadioGroupItem
                        value="TENANT"
                        id="role-tenant"
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Tenant</span>
                      <span className="text-xs text-muted-foreground">
                        Find rentals
                      </span>
                    </Label>
                    <Label
                      htmlFor="role-landlord"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-input p-4 hover:bg-accent transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                    >
                      <RadioGroupItem
                        value="LANDLORD"
                        id="role-landlord"
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">Landlord</span>
                      <span className="text-xs text-muted-foreground">
                        List properties
                      </span>
                    </Label>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      disabled={isDisabled}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      aria-label="Toggle password visibility"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    disabled={isDisabled}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button
          type="submit"
          form="register-form"
          className="w-full"
          disabled={isDisabled}
        >
          {isDisabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? "Uploading image..." : "Creating account..."}
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
