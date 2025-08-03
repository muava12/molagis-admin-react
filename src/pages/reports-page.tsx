export const ReportsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Reports</h1>
          <p className="mt-2 text-fg-secondary">
            View and analyze your business reports
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-secondary bg-primary p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-fg-primary">
                Report {i + 1}
              </h3>
              <div className="h-2 w-2 rounded-full bg-success-500"></div>
            </div>
            <p className="text-fg-secondary mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-fg-tertiary">Status: Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};