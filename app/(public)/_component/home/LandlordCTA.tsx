"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLogout } from "@/hooks/auth.hooks";
import { useAuthStore } from "@/store/auth-store";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function LandlordCTA() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { user, logout: clearUser } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = "translate(0px, 0px)";
  };

  const handleClick = () => {
    if (user?.role === "LANDLORD") {
      router.push("/dashboard/landlord/properties");
    } else {
      setIsModalOpen(true);
    }
  };

  const { logout } = useLogout();

  const handleLoginAsLandlord = async () => {
    try {
      // 1. Clear local client state first
      clearUser();

      // 2. Wait for the backend/auth provider to invalidate the session/cookies
      await logout();

      // 3. Redirect only after successful logout
      router.push("/login?redirectTo=/dashboard/landlord/properties");
    } catch (error) {
      console.error("Failed to switch account:", error);
      toast.error("Failed to switch account");
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-secondary text-secondary-foreground overflow-hidden">
      {/* Dot Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-heading font-bold mb-4"
        >
          Have a property to rent out?
        </motion.h2>
        <p className="max-w-2xl mx-auto text-secondary-foreground/80 mb-10">
          List your property in minutes and reach thousands of verified tenants.
          Manage requests, approvals, and payments all in one place.
        </p>

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="inline-block"
        >
          {/* Changed from Link to button to handle conditional routing/modals */}
          <button
            ref={btnRef}
            onClick={handleClick}
            className="relative inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-lg transition-colors hover:bg-primary/90"
            style={{ transition: "transform 0.2s ease-out" }}
          >
            List Your Property <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Landlord Access Required Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Landlord Access Required</DialogTitle>
            <DialogDescription>
              You need to be logged in as a landlord to list properties. Please
              log in with a landlord account or register as one to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleLoginAsLandlord}>Login as Landlord</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
