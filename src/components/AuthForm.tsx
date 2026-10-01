import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialLoginButtons from "@/components/SocialLoginButtons/SocialLoginButtons";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { handleLoginAPI, handleSignupAPI } from "../store/features/contents/contentsSlice";

type AuthFormProps = {
  onAuthenticated?: () => void;
  className?: string;
};

export default function AuthForm({ onAuthenticated, className }: AuthFormProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.content);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  useEffect(() => {
    setErrorMessage("");
  }, [loginData, signupData]);

  useEffect(() => {
    console.log("user auth form",user);
    if (user && user?.id) {
      onAuthenticated?.();
    }
  }, [user, onAuthenticated]);

  const closeModel = () => {};
  const navigateUserSocial = (_udata: unknown) => {
      console.log(_udata);
  };

  const extractErrorMessage = (action: unknown): string | undefined => {
    if (!action || typeof action !== "object") return;
    if (!("error" in action)) return;
    const errorValue = (action as { error?: unknown }).error;
    if (!errorValue || typeof errorValue !== "object") return;
    const messageValue = (errorValue as { message?: unknown }).message;
    if (typeof messageValue === "string") return messageValue;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await dispatch(handleLoginAPI(loginData));
    const msg = extractErrorMessage(resp);
    if (msg) {
      setErrorMessage(msg);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const payload = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      phoneNumber: signupData.phoneNumber,
    };

    const resp = await dispatch(handleSignupAPI(payload));
    const msg = extractErrorMessage(resp);
    if (msg) {
      setErrorMessage(msg);
    }
  };

  return (
    <div className={className}>
      <div className="text-center text-xl font-semibold">
        Welcome to Top<span className="ai-name-top-primary">AI</span>Tools
      </div>

      <Tabs defaultValue="login" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 border-none">
          <form onSubmit={handleLogin} className="space-y-4 border-none">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-9 pr-9"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <Button type="submit" className="w-full primary-gradient">
              Login
            </Button>
          </form>

          <div className="relative my-4">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="g-butttons">
            <SocialLoginButtons closeModel={closeModel} isSignUp={true} navigateUserSocial={navigateUserSocial} />
          </div>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={signupData.name}
                onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-mobile">Mobile Number</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-mobile"
                  type="text"
                  placeholder="Enter your Mobile Number"
                  value={signupData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\\d*$/.test(value) && value.length <= 10) {
                      setSignupData((prev) => ({ ...prev, phoneNumber: value }));
                    }
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-9 pr-9"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <Button type="submit" className="w-full primary-gradient">
              Create Account
            </Button>
          </form>

          <div className="relative my-4">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="g-butttons">
            <SocialLoginButtons closeModel={closeModel} isSignUp={true} navigateUserSocial={navigateUserSocial} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
}
