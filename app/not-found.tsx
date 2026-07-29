import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Home, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <Container className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="text-7xl font-bold tracking-tight text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Page Not Found
        </h2>
        <p className="mt-2 text-muted-foreground">
          Oops! The property or page you are looking for doesn&apos;t exist or
          has been moved.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
