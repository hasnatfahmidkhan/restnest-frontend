import { Home, Mail, X } from "lucide-react";
import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "../icons/icons";
import { Container } from "./container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Description */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Home className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="text-xl font-semibold tracking-tight">
                Rest<span className="text-primary">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your next home or list your property with ease. RestNest
              connects tenants and landlords seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/landlord/dashboard"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  List Property
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Connect with us
            </h4>
            <div className="flex items-center gap-2">
              <Link
                href="#"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <GitHubIcon className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LinkedInIcon className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-border/60 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} RestNest. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
