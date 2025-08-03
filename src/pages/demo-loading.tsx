import { useState } from "react";
import { Skeleton } from "@/components/base/loading/skeleton";
import { Spinner } from "@/components/base/loading/spinner";
import { Button } from "@/components/base/buttons/button";

export const DemoLoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Loading Components Demo</h1>
          <p className="mt-2 text-fg-secondary">
            Demonstration of skeleton and spinner loading components
          </p>
        </div>
        <Button onClick={() => setIsLoading(!isLoading)}>
          {isLoading ? "Stop Loading" : "Start Loading"}
        </Button>
      </div>

      {/* Skeleton Examples */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h2 className="text-xl font-semibold text-fg-primary mb-4">Skeleton Examples</h2>
        
        <div className="space-y-6">
          {/* Text Skeleton */}
          <div>
            <h3 className="text-lg font-medium text-fg-primary mb-2">Text Lines</h3>
            <div className="space-y-2">
              <Skeleton width="80%" height={20} />
              <Skeleton width="60%" height={20} />
              <Skeleton width="90%" height={20} />
            </div>
          </div>

          {/* Card Skeleton */}
          <div>
            <h3 className="text-lg font-medium text-fg-primary mb-2">Card Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-secondary rounded-lg p-4 space-y-3">
                  <Skeleton width={40} height={40} rounded="full" />
                  <Skeleton width="80%" height={20} />
                  <Skeleton width="100%" height={16} />
                  <Skeleton width="60%" height={16} />
                  <div className="flex justify-end">
                    <Skeleton width={80} height={32} rounded="md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Skeleton */}
          <div>
            <h3 className="text-lg font-medium text-fg-primary mb-2">Table Layout</h3>
            <div className="border border-secondary rounded-lg overflow-hidden">
              <div className="px-6 py-3 bg-secondary">
                <Skeleton width="120px" height={20} />
              </div>
              <div className="divide-y divide-secondary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center space-x-4">
                    <Skeleton width={32} height={32} rounded="full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="200px" height={16} />
                      <Skeleton width="150px" height={14} />
                    </div>
                    <Skeleton width={80} height={32} rounded="md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner Examples */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h2 className="text-xl font-semibold text-fg-primary mb-4">Spinner Examples</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["xs", "sm", "md", "lg"].map((size) => (
            <div key={size} className="text-center">
              <div className="mb-2">
                <Spinner size={size as any} />
              </div>
              <div className="text-sm text-fg-secondary capitalize">Size: {size}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
          {["primary", "secondary", "success", "warning", "error", "white"].map((color) => (
            <div key={color} className="text-center">
              <div className="mb-2 flex justify-center">
                <Spinner color={color as any} />
              </div>
              <div className="text-sm text-fg-secondary capitalize">{color}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading State Demo */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h2 className="text-xl font-semibold text-fg-primary mb-4">Loading State Demo</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
            <div className="text-center text-fg-secondary">
              Loading content...
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-fg-primary mb-2">Content Loaded Successfully!</div>
            <div className="text-fg-secondary">Click the button above to toggle loading state</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoLoadingPage;