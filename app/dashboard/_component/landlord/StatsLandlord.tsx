"use client";

import { Counter } from "@/app/(public)/_component/home/Counter";
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
import { useLandlordStats } from "@/hooks/useLandlordStats";
import { motion } from "framer-motion";
import { Building, FileText, Home, Star, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

// Helper for mouse spotlight effect
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

export default function StatsLandlord() {
  const { data, isPending } = useLandlordStats();

  if (isPending || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Data formatting for Charts
  const propertyChartData = [
    {
      name: "Available",
      value: data.availableProperties,
      fill: "var(--chart-2)",
    },
    { name: "Rented", value: data.rentedProperties, fill: "var(--chart-1)" },
  ];

  const rentalRequestChartData = [
    { name: "Pending", value: data.pendingRequests, fill: "var(--chart-3)" },
    { name: "Approved", value: data.approvedRequests, fill: "var(--chart-2)" },
    { name: "Active", value: data.activeRentals, fill: "var(--chart-1)" },
    { name: "Completed", value: data.completedRentals, fill: "var(--chart-4)" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Revenue Banner */}
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
              Total Revenue Generated
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-linear-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              <Counter value={Number(data.totalRevenue)} suffix="$" />
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Active Rentals: {data.activeRentals}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Properties */}
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
                Total Properties
              </CardTitle>
              <Building className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                <Counter value={data.totalProperties} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.availableProperties} Available | {data.rentedProperties}{" "}
                Rented
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: Rental Requests */}
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
                  "radial-gradient(300px circle at var(--x) var(--y), rgba(168, 85, 247, 0.1), transparent 40%)",
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
                <Counter value={data.totalRentalRequests} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.pendingRequests} Pending | {data.approvedRequests}{" "}
                Approved
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3: Active Rentals */}
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
                <Counter value={data.activeRentals} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.completedRentals} Completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 4: Average Rating */}
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
                  "radial-gradient(300px circle at var(--x) var(--y), rgba(245, 158, 11, 0.1), transparent 40%)",
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Rating
              </CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground flex items-center gap-1">
                <Counter value={data.averageRating} />{" "}
                <span className="text-lg text-muted-foreground">/5</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.totalReviews} Total Reviews
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Property Distribution</CardTitle>
              <CardDescription>Available vs Rented Properties</CardDescription>
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
                    data={propertyChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {propertyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center gap-6 mt-4">
                {propertyChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rental Requests Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Rental Pipeline</CardTitle>
              <CardDescription>
                Current status of all rental requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="aspect-h-[300px] w-full">
                <BarChart
                  data={rentalRequestChartData}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
