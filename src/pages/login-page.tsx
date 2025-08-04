import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useNavigate } from "react-router-dom";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { email, password, rememberMe });
    // For now, redirect to dashboard after "login"
    navigate("/app/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-primary">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <UntitledLogo className="h-12 w-auto" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-fg-primary">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                onChange={(e: any) => setEmail(e.target.value)}
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
                onChange={(e: any) => setPassword(e.target.value)}
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

          <div>
            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-fg-secondary">
          Don't have an account?{' '}
          <a href="#" className="font-semibold leading-6 text-brand hover:text-brand_hover">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};