import { BarChart03, Users01, Rows01, PieChart03 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { Skeleton } from "@/components/base/loading";

export const DashboardPage = () => {
  const { data, loading, error } = useDashboardMetrics();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      label: "Dana Belum Diproses",
      value: data?.outstandingRevenue ? formatCurrency(data.outstandingRevenue) : "0",
      change: "+12%",
      icon: PieChart03,
      color: "text-purple-600",
    },
    {
      label: "Active Customers",
      value: data?.activeCustomerCount || "0",
      change: "+8%",
      icon: Users01,
      color: "text-blue-600",
    },
    {
      label: "Total Orders",
      value: "89",
      change: "+8%",
      icon: Rows01,
      color: "text-green-600",
    },
    {
      label: "Growth",
      value: "23.5%",
      change: "+5%",
      icon: BarChart03,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Dashboard</h1>
          <p className="mt-2 text-fg-secondary">
            Welcome to your business dashboard
          </p>
        </div>
        <Button color="primary" size="lg">
          Quick Action
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-secondary bg-primary p-6 shadow-sm"
              >
                <Skeleton className="h-8 w-8 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))
          : stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-lg border border-secondary bg-primary p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <span className="text-xs text-success-600 font-medium">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-fg-tertiary">{stat.label}</p>
                <p className="text-2xl font-bold text-fg-primary mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-fg-primary">
              Recent Activity
            </h3>
            <BadgeWithDot color="success" type="modern" size="sm">
              Live
            </BadgeWithDot>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary_hover transition-colors">
                <div className="h-2 w-2 rounded-full bg-success-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-fg-primary">
                    New order from Customer {i + 1}
                  </p>
                  <p className="text-xs text-fg-tertiary">
                    {i + 1} minutes ago
                  </p>
                </div>
                <Button color="secondary" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-fg-primary mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add Customer", icon: Users01, color: "primary" },
              { label: "New Order", icon: Rows01, color: "secondary" },
              { label: "View Reports", icon: PieChart03, color: "tertiary" },
              { label: "Analytics", icon: BarChart03, color: "primary" },
            ].map((action, i) => (
              <Button
                key={i}
                color={action.color as any}
                size="lg"
                iconLeading={action.icon}
                className="h-20 flex-col gap-2"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-fg-primary">
            Sales Overview
          </h3>
          <div className="flex items-center gap-2">
            <Button color="secondary" size="sm">
              This Week
            </Button>
            <Button color="tertiary" size="sm">
              This Month
            </Button>
          </div>
        </div>
        
        {/* Placeholder for chart */}
        <div className="h-64 rounded-lg bg-secondary flex items-center justify-center">
          <div className="text-center">
            <BarChart03 className="h-12 w-12 text-fg-quaternary mx-auto mb-4" />
            <p className="text-fg-secondary">Chart will be displayed here</p>
            <p className="text-sm text-fg-tertiary">Integration with chart library needed</p>
          </div>
        </div>
      </div>
    </div>
  );
};