import { Plus, TrendUp01, TrendDown01, CurrencyDollar, CreditCard01, Receipt, PieChart03 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";

export const FinancePage = () => {
  // Mock data untuk demo
  const transactions = [
    {
      id: "TXN-001",
      type: "income",
      description: "Order Payment - ORD-001",
      amount: 250000,
      date: "2024-01-15",
      category: "Sales",
    },
    {
      id: "TXN-002",
      type: "expense",
      description: "Supplier Payment",
      amount: -120000,
      date: "2024-01-14",
      category: "Inventory",
    },
    {
      id: "TXN-003",
      type: "income",
      description: "Order Payment - ORD-002",
      amount: 180000,
      date: "2024-01-14",
      category: "Sales",
    },
    {
      id: "TXN-004",
      type: "expense",
      description: "Marketing Campaign",
      amount: -50000,
      date: "2024-01-13",
      category: "Marketing",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <TrendUp01 className="h-5 w-5 text-success-600" />
    ) : (
      <TrendDown01 className="h-5 w-5 text-error-600" />
    );
  };

  const getTransactionBadge = (type: string) => {
    return type === "income" ? (
      <BadgeWithDot color="success" type="modern" size="sm">Income</BadgeWithDot>
    ) : (
      <BadgeWithDot color="error" type="modern" size="sm">Expense</BadgeWithDot>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Finance</h1>
          <p className="mt-2 text-fg-secondary">
            Track your business financial performance
          </p>
        </div>
        <Button color="primary" size="lg" iconLeading={Plus}>
          Add Transaction
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            label: "Total Revenue", 
            value: "Rp 45.2M", 
            change: "+15%", 
            icon: CurrencyDollar,
            color: "text-success-600",
            bgColor: "bg-success-50"
          },
          { 
            label: "Total Expenses", 
            value: "Rp 12.8M", 
            change: "+8%", 
            icon: CreditCard01,
            color: "text-error-600",
            bgColor: "bg-error-50"
          },
          { 
            label: "Net Profit", 
            value: "Rp 32.4M", 
            change: "+22%", 
            icon: TrendUp01,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
          },
          { 
            label: "Profit Margin", 
            value: "71.7%", 
            change: "+5%", 
            icon: PieChart03,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-lg border border-secondary bg-primary p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
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

      {/* Recent Transactions */}
      <div className="rounded-xl border border-secondary bg-primary overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-secondary">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-fg-primary">
              Recent Transactions
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
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-primary_hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="text-sm font-medium text-fg-primary">
                        {transaction.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-fg-primary">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-fg-secondary">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.type === "income" ? "text-success-600" : "text-error-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTransactionBadge(transaction.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-secondary">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary & Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Summary */}
        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-fg-primary mb-6">
            Monthly Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-success-50 dark:bg-success-900/20">
              <div className="flex items-center gap-3">
                <TrendUp01 className="h-5 w-5 text-success-600" />
                <span className="font-medium text-success-700 dark:text-success-400">Total Income</span>
              </div>
              <span className="font-bold text-success-700 dark:text-success-400">
                {formatCurrency(4520000)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 rounded-lg bg-error-50 dark:bg-error-900/20">
              <div className="flex items-center gap-3">
                <TrendDown01 className="h-5 w-5 text-error-600" />
                <span className="font-medium text-error-700 dark:text-error-400">Total Expenses</span>
              </div>
              <span className="font-bold text-error-700 dark:text-error-400">
                {formatCurrency(1280000)}
              </span>
            </div>
            
            <hr className="border-secondary" />
            
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <CurrencyDollar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-700 dark:text-blue-400">Net Profit</span>
              </div>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {formatCurrency(3240000)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-fg-primary mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button color="primary" size="lg" iconLeading={Plus} className="w-full justify-start">
              Record Income
            </Button>
            <Button color="secondary" size="lg" iconLeading={Receipt} className="w-full justify-start">
              Add Expense
            </Button>
            <Button color="tertiary" size="lg" iconLeading={PieChart03} className="w-full justify-start">
              Generate Report
            </Button>
            <Button color="tertiary" size="lg" iconLeading={CreditCard01} className="w-full justify-start">
              Reconcile Accounts
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="rounded-xl border border-secondary bg-primary p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-fg-primary">
            Financial Trends
          </h3>
          <div className="flex items-center gap-2">
            <Button color="secondary" size="sm">
              This Month
            </Button>
            <Button color="tertiary" size="sm">
              Last 6 Months
            </Button>
          </div>
        </div>
        
        {/* Placeholder for chart */}
        <div className="h-64 rounded-lg bg-secondary flex items-center justify-center">
          <div className="text-center">
            <PieChart03 className="h-12 w-12 text-fg-quaternary mx-auto mb-4" />
            <p className="text-fg-secondary">Financial chart will be displayed here</p>
            <p className="text-sm text-fg-tertiary">Integration with chart library needed</p>
          </div>
        </div>
      </div>
    </div>
  );
};