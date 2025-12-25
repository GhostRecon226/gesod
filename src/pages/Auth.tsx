import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "register" | "forgot" | "reset";

// Schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and policies to continue" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotFormData = z.infer<typeof forgotSchema>;

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, role, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get redirect path from location state or default based on role
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  // Redirect authenticated users
  useEffect(() => {
    if (user && role) {
      const redirectPath = from || (role === "admin" ? "/admin" : "/dashboard");
      navigate(redirectPath, { replace: true });
    }
  }, [user, role, navigate, from]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", acceptTerms: false as unknown as true },
  });

  const acceptTerms = registerForm.watch("acceptTerms");

  // Forgot password form
  const forgotForm = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
      });
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    
    if (error) {
      let message = error.message;
      if (error.message.includes("already registered")) {
        message = "An account with this email already exists. Please sign in instead.";
      }
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: message,
      });
    }
    setIsSubmitting(false);
  };

  const handleForgotPassword = async (data: ForgotFormData) => {
    setIsSubmitting(true);
    const { error } = await resetPassword(data.email);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error.message,
      });
    } else {
      setMode("login");
    }
    setIsSubmitting(false);
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Welcome back";
      case "register": return "Create your account";
      case "forgot": return "Reset your password";
      default: return "Welcome";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login": return "Sign in to access your dashboard";
      case "register": return "Join GESOD RIDES for seamless vehicle logistics";
      case "forgot": return "Enter your email to receive a reset link";
      default: return "";
    }
  };

  return (
    <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
      {mode === "login" && (
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...loginForm.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        </form>
      )}

      {mode === "register" && (
        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...registerForm.register("fullName")}
            />
            {registerForm.formState.errors.fullName && (
              <p className="text-sm text-destructive">{registerForm.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registerEmail">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="registerEmail"
              type="email"
              placeholder="you@example.com"
              {...registerForm.register("email")}
            />
            {registerForm.formState.errors.email && (
              <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registerPassword">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="registerPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...registerForm.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {registerForm.formState.errors.password && (
              <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...registerForm.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {registerForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms === true}
                onCheckedChange={(checked) => 
                  registerForm.setValue("acceptTerms", checked === true ? true : false as unknown as true, { shouldValidate: true })
                }
                className="mt-1"
              />
              <label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline font-medium" target="_blank">
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link to="/privacy" className="text-primary hover:underline font-medium" target="_blank">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link to="/consent" className="text-primary hover:underline font-medium" target="_blank">
                  Consent Policy
                </Link>
              </label>
            </div>
            {registerForm.formState.errors.acceptTerms && (
              <p className="text-sm text-destructive">{registerForm.formState.errors.acceptTerms.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || acceptTerms !== true}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          <div className="space-y-2">
            <Label htmlFor="forgotEmail">Email</Label>
            <Input
              id="forgotEmail"
              type="email"
              placeholder="you@example.com"
              {...forgotForm.register("email")}
            />
            {forgotForm.formState.errors.email && (
              <p className="text-sm text-destructive">{forgotForm.formState.errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
