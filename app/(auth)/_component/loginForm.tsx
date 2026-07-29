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
import { loginSchema, TLoginInput } from "../_schemas/auth.schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isPending } = useLogin();

  const form = useForm<TLoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: TLoginInput) {
    await mutateAsync(data);
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
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
      </CardFooter>
    </Card>
  );
}
