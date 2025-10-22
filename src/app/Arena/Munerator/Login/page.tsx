
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/provider";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { appConfig } from "@/app/config";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email to reset your password." }),
});

export default function MuneratorLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (appConfig.maintenance) {
      router.push("/Arena/Home");
    }
  }, [router]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting you to the dashboard.",
      });
      router.push("/Arena/Munerator/Dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    setIsSubmitting(true);
    try {
       await sendPasswordResetEmail(auth, values.email, {
         url: `${window.location.origin}/Arena/Munerator/Login`,
       });
       toast({
         title: "Password Reset Email Sent",
         description: "Please check your inbox to reset your password.",
       });
       setIsResetting(false);
    } catch (error: any) {
       console.error("Password Reset Error:", error);
       toast({
         title: "Reset Failed",
         description: error.message || "Could not send the reset email.",
         variant: "destructive",
       });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (appConfig.maintenance) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            Munerator Login
          </CardTitle>
          <CardDescription>
            {isResetting
              ? "Enter your email to receive a password reset link."
              : "Access your dashboard to manage your games."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResetting ? (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging In..." : "Login"}
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center text-sm">
            {isResetting ? (
              <p>
                Remember your password?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsResetting(false)}>
                  Back to Login
                </Button>
              </p>
            ) : (
              <>
                <p>
                  <Button variant="link" className="p-0 h-auto" onClick={() => setIsResetting(true)}>
                    Forgot Password?
                  </Button>
                </p>
                <p>
                  Don't have an account?{" "}
                  <Link href="/Arena/Munerator/Signup" className="font-semibold text-primary hover:underline">
                    Sign Up
                  </Link>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
