import { Container } from "@/components/shared/container";
import { Home } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "../_component/loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <Container className="flex flex-col items-center max-w-md">
        {/* Logo Header */}
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Home className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Rent<span className="text-primary">Nest</span>
          </span>
        </Link>

        {/* Form Card */}
        <LoginForm />
      </Container>
    </div>
  );
}
