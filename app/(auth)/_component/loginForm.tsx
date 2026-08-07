/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

import { useLogin } from "@/hooks/auth.hooks";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { loginSchema, TLoginInput } from "../_schemas/auth.schema";
import { googleLoginService } from "../_sevices/auth.service";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isPending } = useLogin();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: TLoginInput) {
    await mutateAsync(data);
  }

  // Demo Login Handler
  const handleDemoLogin = async (role: "TENANT" | "LANDLORD" | "ADMIN") => {
    let demoCreds = { email: "", password: "" };

    if (role === "TENANT")
      demoCreds = { email: "tenant@gmail.com", password: "123456" };
    if (role === "LANDLORD")
      demoCreds = { email: "landlord2@gmail.com", password: "123456" };
    if (role === "ADMIN")
      demoCreds = { email: "hasnat@gmail.com", password: "123456" };

    // Update form fields visually
    form.setValue("email", demoCreds.email);
    form.setValue("password", demoCreds.password);

    // Trigger login
    await mutateAsync(demoCreds);
  };

  // Google Login Handler (Mock)
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error("Google authentication failed.");

      await googleLoginService(idToken);
      toast.success("Logged in successfully with Google!");

      // Hard redirect to ensure cookies are picked up by the browser
      window.location.href = "/dashboard/tenant";
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google Login Button */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login Failed")}
            text="continue_with"
            shape="circle"
            width="320"
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form
          id="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email Address</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="john@example.com"
                    autoComplete="email"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <a
                      href="#"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <div className="relative">
                    <Input
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
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
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </p>

        {/* Demo Login Section */}
        <div className="w-full pt-4 border-t mt-2">
          <p className="text-center text-xs text-muted-foreground mb-3">
            Just exploring? Try a demo account:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin("TENANT")}
              disabled={isPending}
            >
              Tenant
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin("LANDLORD")}
              disabled={isPending}
            >
              Landlord
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin("ADMIN")}
              disabled={isPending}
            >
              Admin
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
