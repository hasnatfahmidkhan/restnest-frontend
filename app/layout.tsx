import ScrollToTop from "@/components/shared/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/authProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geist.variable, jakarta.variable, "font-sans")}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <LenisProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <AuthProvider>
                <Toaster richColors position="top-right" closeButton />
                <TooltipProvider>
                  {children}
                  <Suspense fallback={null}>
                    <ScrollToTop />
                  </Suspense>
                </TooltipProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
