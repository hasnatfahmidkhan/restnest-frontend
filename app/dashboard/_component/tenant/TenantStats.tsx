"use client";

import { Counter } from "@/app/(public)/_component/home/Counter";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentRequest, useTenantStats } from "@/hooks/useTenantStats";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Home, ImageOff, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";

// Helper for mouse spotlight effect
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

// Helper for status badges
const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/30",
    ACTIVE: "bg-green-500/10 text-green-600 border-green-500/30",
    COMPLETED: "bg-gray-500/10 text-gray-600 border-gray-500/30",
    CANCELED: "bg-slate-700/10 text-slate-500 border-slate-700/30",
  };
  return <Badge className={styles[status] || ""}>{status}</Badge>;
};

export default function TenantStatsDashboard() {
  const { data, isPending } = useTenantStats();

  if (isPending || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { overview, recentRequests } = data;

  // Data formatting for Donut Chart
  const requestChartData = [
    {
      name: "Pending",
      value: overview.pendingRequests,
      fill: "var(--chart-3)",
    },
    {
      name: "Approved",
      value: overview.approvedRequests,
      fill: "var(--chart-2)",
    },
    { name: "Active", value: overview.activeRentals, fill: "var(--chart-1)" },
    {
      name: "Rejected",
      value: overview.rejectedRequests,
      fill: "var(--chart-4)",
    },
    {
      name: "Completed",
      value: overview.completedRentals,
      fill: "var(--chart-5)",
    },
  ].filter((item) => item.value > 0); // Only show slices if they have value

  return (
    <div className="space-y-8">
      {/* Header Total Paid Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(var(--primary) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Total Amount Paid (Lifetime)
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-linear-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              <Counter value={Number(overview.totalPaid)} suffix="$" />
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
            <Home className="w-4 h-4" />
            Active Rentals: {overview.activeRentals}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(300px circle at var(--x) var(--y), rgba(59, 130, 246, 0.1), transparent 40%)",
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                <Counter value={overview.totalRequests} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview.pendingRequests} Pending | {overview.approvedRequests}{" "}
                Approved
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: Active Rentals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(300px circle at var(--x) var(--y), rgba(34, 197, 94, 0.1), transparent 40%)",
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Rentals
              </CardTitle>
              <Home className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                <Counter value={overview.activeRentals} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently living in
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3: Completed Rentals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(300px circle at var(--x) var(--y), rgba(168, 85, 247, 0.1), transparent 40%)",
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                <Counter value={overview.completedRentals} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Finished leases
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 4: Rejected Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card
            onMouseMove={handleMouseMove}
            className="group relative overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(300px circle at var(--x) var(--y), rgba(239, 68, 68, 0.1), transparent 40%)",
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
              <XCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                <Counter value={overview.rejectedRequests} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview.cancelledRequests} Canceled by you
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Funnel Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Request Funnel</CardTitle>
              <CardDescription>
                Status breakdown of all your requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square max-h-62.5"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" />}
                  />
                  <Pie
                    data={requestChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {requestChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {requestChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest rental requests and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Property</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((req: RecentRequest) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <Link
                          href={`/properties/${req.property.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                            {req.property.propertyImages?.[0] ? (
                              <Image
                                fill
                                src={req.property.propertyImages[0].url}
                                alt={req.property.title}
                                className="object-cover"
                              />
                            ) : (
                              <ImageOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground hover:text-primary">
                              {req.property.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {req.property.city} | ${req.property.rentPrice}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(req.moveInDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
