import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { analyticsService, profileService } from "../services/api";
import {
  Card,
  CardHeader,
  CardBody,
  LoadingSpinner,
  StatCard,
  Button,
  Input,
} from "../components/ui";
import { formatCurrency, formatDate } from "../lib/utils";
import { TrendingUp } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import type { RevenueDataPoint } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// ===========================
// ANALYTICS PAGE
// ===========================
export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsService.dashboard().then((r) => r.data.data),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenue-chart", period],
    queryFn: () => analyticsService.revenue(period).then((r) => r.data.data),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">
          Deep insights into your revenue and growth
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.monthRevenue || 0)}
          change={stats?.revenueGrowth}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Revenue Trend</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === p ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {revenueLoading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData as RevenueDataPoint[]}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatDate(v).slice(0, 6)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₦${(v / 100).toLocaleString()}`}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  labelFormatter={(l) => formatDate(l)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>

      {/* Volume bar chart */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Transaction Volume</h2>
        </CardHeader>
        <CardBody>
          {revenueLoading ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData as RevenueDataPoint[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatDate(v).slice(0, 6)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip labelFormatter={(l) => formatDate(l)} />
                <Bar
                  dataKey="count"
                  name="Transactions"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// ===========================
// SETTINGS PAGE
// ===========================

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
});
type ProfileForm = z.infer<typeof profileSchema>;

const businessSchema = z.object({
  name: z.string().min(1, "Required"),
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Only letters, numbers and dashes"),
});
type BusinessForm = z.infer<typeof businessSchema>;

export const SettingsPage: React.FC = () => {
  const { user, business, updateUser, updateBusiness } = useAuthStore();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const businessForm = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
    values: {
      name: business?.name || "",
      slug: business?.slug || "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => profileService.updateProfile(data),
    onSuccess: (res) => {
      const data = res.data.data;
      if (data.firstName || data.lastName) {
        updateUser(data);
        toast.success("Profile updated");
        setEditingProfile(false);
      } else if (data.name || data.slug) {
        updateBusiness(data);
        toast.success("Business updated");
        setEditingBusiness(false);
      } else {
        // Fallback for generic updates
        toast.success("Settings updated");
        setEditingProfile(false);
        setEditingBusiness(false);
      }
    },
    onError: () => toast.error("Failed to update settings"),
  });


  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account and business settings
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Profile</h2>
            {!editingProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingProfile(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {editingProfile ? (
            <form
              onSubmit={profileForm.handleSubmit((data) =>
                profileMutation.mutate(data),
              )}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  {...profileForm.register("firstName")}
                  error={profileForm.formState.errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  {...profileForm.register("lastName")}
                  error={profileForm.formState.errors.lastName?.message}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProfile(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  loading={profileMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {user?.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {user?.lastName}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Business */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Business</h2>
            {!editingBusiness && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingBusiness(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {editingBusiness ? (
            <form
              onSubmit={businessForm.handleSubmit((data) =>
                profileMutation.mutate(data),
              )}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Business Name"
                  {...businessForm.register("name")}
                  error={businessForm.formState.errors.name?.message}
                />
                <Input
                  label="Slug"
                  {...businessForm.register("slug")}
                  error={businessForm.formState.errors.slug?.message}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingBusiness(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  loading={profileMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {business?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-500 font-mono">
                    {business?.slug}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {business?.settings?.currency || "NGN"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {business?.settings?.timezone || "Africa/Lagos"}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Interswitch */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Payment Gateway</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              IS
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Interswitch</p>
              <p className="text-xs text-blue-600">Connected — Test Mode</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Configure your Interswitch credentials in your environment
            variables. See .env.example for details.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
