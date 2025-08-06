import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Skeleton } from "@/components/base/loading/skeleton";
import { Spinner } from "@/components/base/loading/spinner";

export const DevelopmentPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg-primary">Development Testing</h1>
            <p className="mt-2 text-fg-secondary">
              Area for testing new features before implementing in production
            </p>
          </div>
          <Button onClick={() => setIsLoading(!isLoading)}>
            {isLoading ? "Stop Loading" : "Start Loading"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Component Testing Card */}
          <div className="border border-secondary bg-primary rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-fg-primary">Component Testing</h2>
              <p className="text-fg-secondary">Test new UI components here</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="test-input">Test Input</Label>
                <Input
                  id="test-input"
                  value={inputValue}
                  onChange={setInputValue}
                  placeholder="Type something..."
                />
              </div>
              <div className="flex gap-3">
                <Button color="primary">Primary Button</Button>
                <Button color="secondary">Secondary Button</Button>
              </div>
            </div>
          </div>

          {/* Loading States Card */}
          <div className="border border-secondary bg-primary rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-fg-primary">Loading States</h2>
              <p className="text-fg-secondary">Test loading indicators</p>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton width="100%" height={20} />
                  <Skeleton width="80%" height={20} />
                  <Skeleton width="60%" height={20} />
                </div>
              ) : (
                <p className="text-fg-primary">Content loaded successfully!</p>
              )}
              
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
            </div>
          </div>

          {/* Feature Preview Card */}
          <div className="border border-secondary bg-primary rounded-lg p-6 md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-fg-primary">Feature Preview</h2>
              <p className="text-fg-secondary">Preview upcoming features</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-secondary bg-secondary">
                <h3 className="font-medium text-fg-primary">New Feature</h3>
                <p className="text-sm text-fg-secondary mt-1">
                  This is a preview of a new feature being developed.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border border-secondary bg-secondary">
                <h3 className="font-medium text-fg-primary">Experimental UI</h3>
                <p className="text-sm text-fg-secondary mt-1">
                  Testing new UI patterns and interactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};