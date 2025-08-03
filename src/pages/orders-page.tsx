import { Plus, Edit01, Trash01, Package, Clock, CheckCircle, XCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";

export const OrdersPage = () => {
  // Mock data untuk demo
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      items: 3,
      total: 250000,
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "ORD-002", 
      customer: "Jane Smith",
      items: 2,
      total: 180000,
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson", 
      items: 5,
      total: 420000,
      status: "completed",
      date: "2024-01-13",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      items: 1,
      total: 95000,
      status: "cancelled",
      date: "2024-01-12",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <BadgeWithDot color="warning" type="modern" size="sm">Pending</BadgeWithDot>;
      case "processing":
        return <BadgeWithDot color="blue" type="modern" size="sm">Processing</BadgeWithDot>;
      case "completed":
        return <BadgeWithDot color="success" type="modern" size="sm">Completed</BadgeWithDot>;
      case "cancelled":
        return <BadgeWithDot color="error" type="modern" size="sm">Cancelled</BadgeWithDot>;
      default:
        return <BadgeWithDot color="gray" type="modern" size="sm">Unknown</BadgeWithDot>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-warning-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-primary-600" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-error-600" />;
      default:
        return <Package className="h-5 w-5 text-fg-quaternary" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Orders</h1>
          <p className="mt-2 text-fg-secondary">
            Manage and track all customer orders
          </p>
        </div>
        <Button color="primary" size="lg" iconLeading={Plus}>
          New Order
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Orders", value: "1,234", change: "+12%", color: "text-blue-600" },
          { label: "Pending", value: "45", change: "+8%", color: "text-warning-600" },
          { label: "Processing", value: "23", change: "-2%", color: "text-primary-600" },
          { label: "Completed", value: "1,166", change: "+15%", color: "text-success-600" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-lg border border-secondary bg-primary p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-fg-tertiary">{stat.label}</p>
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-success-600' : 'text-error-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-fg-primary mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-secondary bg-primary overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-secondary">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-fg-primary">
              Recent Orders
            </h3>
            <Button color="secondary" size="sm">
              View All
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-primary_hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium text-fg-primary">
                        {order.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-fg-primary">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-fg-secondary">
                      {order.items} items
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-fg-primary">
                      {formatCurrency(order.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-secondary">
                    {new Date(order.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        color="tertiary"
                        iconLeading={Edit01}
                        aria-label="Edit order"
                      />
                      <Button
                        size="sm"
                        color="tertiary-destructive"
                        iconLeading={Trash01}
                        aria-label="Delete order"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-fg-primary mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button color="primary" size="lg" iconLeading={Plus} className="w-full justify-start">
              Create New Order
            </Button>
            <Button color="secondary" size="lg" iconLeading={Package} className="w-full justify-start">
              Bulk Update Status
            </Button>
            <Button color="tertiary" size="lg" iconLeading={CheckCircle} className="w-full justify-start">
              Mark as Completed
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-fg-primary mb-4">
            Order Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-fg-secondary">Today's Orders</span>
              <span className="font-semibold text-fg-primary">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fg-secondary">Revenue Today</span>
              <span className="font-semibold text-fg-primary">{formatCurrency(2450000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fg-secondary">Avg. Order Value</span>
              <span className="font-semibold text-fg-primary">{formatCurrency(102083)}</span>
            </div>
            <hr className="border-secondary" />
            <div className="flex justify-between items-center">
              <span className="text-fg-primary font-medium">Total This Month</span>
              <span className="font-bold text-lg text-fg-primary">{formatCurrency(45200000)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};