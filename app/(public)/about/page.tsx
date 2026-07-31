import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ShieldCheck, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          Our Story
        </Badge>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Simplifying Renting for Everyone
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          RestNest was born out of a simple idea: finding a home shouldn&apos;t
          be stressful. We connect trustworthy tenants with reliable landlords
          through a transparent, secure, and easy-to-use platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { label: "Properties Listed", value: "10k+" },
          { label: "Happy Tenants", value: "25k+" },
          { label: "Verified Landlords", value: "5k+" },
          { label: "Cities Covered", value: "12" },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="text-center bg-muted/30 border-dashed"
          >
            <CardContent className="pt-6">
              <h3 className="text-3xl font-bold text-primary mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-heading font-semibold">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            To empower people to find their perfect home with ease, eliminating
            bureaucracy and fostering trust between landlords and tenants.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-heading font-semibold">Our Vision</h3>
          <p className="text-muted-foreground leading-relaxed">
            To be the leading digital rental platform in the region, known for
            innovation, security, and exceptional user experience.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-heading font-semibold">Our Values</h3>
          <p className="text-muted-foreground leading-relaxed">
            Transparency, security, and user-centricity are at the core of
            everything we build. We protect your data and your peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
}
