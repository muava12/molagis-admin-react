import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { useSupabase } from "@/providers/supabase-provider";
import { Tabs, TabList, Tab, TabPanel } from "@/components/application/tabs/tabs";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useSupabase();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    const from = location.state?.from?.pathname || "/app/dashboard";
    navigate(from, { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Auth state change will trigger redirect in the useEffect
      const from = location.state?.from?.pathname || "/app/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setSuccess("Registration successful! Please check your email to confirm your account.");
      setActiveTab("login");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-primary">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <UntitledLogo className="h-12 w-auto" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-fg-primary">
          Welcome to Molagis
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
          <TabList 
            aria-label="Account access" 
            className="flex w-full rounded-lg bg-secondary p-1"
            items={[
              { id: "login", label: "Sign In" },
              { id: "register", label: "Register" }
            ]}
          >            
            {(item) => (
              <Tab id={item.id} className="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium">
                {item.label}
              </Tab>
            )}
          </TabList>
          
          <TabPanel id="login">
            <form className="space-y-6 mt-6" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium leading-6 text-fg-primary">
                  Email address
                </Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    isRequired
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm font-medium leading-6 text-fg-primary">
                    Password
                  </Label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-brand hover:text-brand_hover">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    isRequired
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  isSelected={rememberMe}
                  onChange={setRememberMe}
                />
                <Label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-fg-primary">
                  Remember me
                </Label>
              </div>

              {error && (
                <div className="rounded-md bg-error/10 p-3 text-sm text-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-success/10 p-3 text-sm text-success">
                  {success}
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </TabPanel>
          
          <TabPanel id="register">
            <form className="space-y-6 mt-6" onSubmit={handleSignUp}>
              <div>
                <Label htmlFor="register-email" className="block text-sm font-medium leading-6 text-fg-primary">
                  Email address
                </Label>
                <div className="mt-2">
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    isRequired
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-password" className="block text-sm font-medium leading-6 text-fg-primary">
                  Password
                </Label>
                <div className="mt-2">
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    isRequired
                    value={password}
                    onChange={setPassword}
                    placeholder="Create a password"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-error/10 p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          </TabPanel>
        </Tabs>

        <p className="mt-10 text-center text-sm text-fg-secondary">
          By signing in or creating an account, you agree to our{' '}
          <a href="#" className="font-semibold leading-6 text-brand hover:text-brand_hover">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="font-semibold leading-6 text-brand hover:text-brand_hover">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};