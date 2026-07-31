import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BellRing,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Search,
  Star,
  ThumbsUp,
  User,
} from "lucide-react";

const tenantSteps = [
  {
    icon: User,
    title: "Register / Login",
    desc: "Create your secure tenant account to get started.",
  },
  {
    icon: Search,
    title: "Browse Properties",
    desc: "Filter through hundreds of verified properties.",
  },
  {
    icon: Eye,
    title: "View Details",
    desc: "Inspect high-quality images, amenities, and pricing.",
  },
  {
    icon: FileText,
    title: "Submit Request",
    desc: "Fill out the Zod-validated rent request form.",
  },
  {
    icon: Clock,
    title: "Wait for Approval",
    desc: "Track your request status in real-time via UI.",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    desc: 'Once approved, click "Pay Now" to redirect to SSLCommerz/Stripe.',
  },
  {
    icon: CheckCircle2,
    title: "Payment Success",
    desc: "Confirm your booking on the success page.",
  },
  {
    icon: Star,
    title: "Leave a Review",
    desc: "Share your experience with the community.",
  },
];

const landlordSteps = [
  {
    icon: User,
    title: "Register / Login",
    desc: "Set up your landlord profile securely.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Overview",
    desc: "Get insights into your properties and earnings.",
  },
  {
    icon: PlusCircle,
    title: "Create Listing",
    desc: "Upload images and list your property details.",
  },
  {
    icon: ListChecks,
    title: "View Requests",
    desc: "Access a comprehensive table of incoming rent requests.",
  },
  {
    icon: ThumbsUp,
    title: "Approve / Reject",
    desc: "Select tenants with a single click.",
  },
  {
    icon: BellRing,
    title: "Tenant Notified",
    desc: 'Toast notification triggers: "Request Approved". Tenant can now pay.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          Guidelines
        </Badge>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          How RestNest Works
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Whether you are looking for a place to call home or a landlord looking
          to rent out your property, we&apos;ve made the process simple and
          secure.
        </p>
      </div>

      {/* Tenant Journey */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Home className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-heading font-bold">Tenant Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tenantSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <Card className="h-full hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-primary/50 text-sm font-bold">
                      0{idx + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
              {/* Arrow for larger screens */}
              {idx < tenantSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground/30 z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed text-sm text-muted-foreground text-center">
          UI Focus: Loading spinners show during form submission. Toast
          notifications trigger for success/failure at every step.
        </div>
      </div>

      {/* Landlord Journey */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-heading font-bold">Landlord Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landlordSteps.map((step, idx) => (
            <Card
              key={idx}
              className="h-full hover:border-primary/30 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-2">
                  <step.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary/50 text-sm font-bold">
                    0{idx + 1}
                  </span>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
