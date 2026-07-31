import { Home, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-100 flex min-h-screen w-full flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-6">
        {/* Pulsing Brand Logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 backdrop-blur-md">
            <Home className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Brand Name & Spinner */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-heading font-bold text-foreground">
            RestNest
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm font-medium tracking-wide animate-pulse">
              Preparing your experience...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
