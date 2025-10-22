
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
import { useState } from "react";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

const signupSchema = z
  .object({
    sponsorName: z.string().min(2, "Sponsor name is required"),
    brandName: z.string().min(2, "Brand name is required"),
    contactPerson: z.string().min(2, "Contact person is required"),
    contactNumber: z.string().regex(/^[0-9]{10,15}$/, "Please enter a valid phone number"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function MuneratorSignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      sponsorName: "",
      brandName: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsSubmitting(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2. Create sponsor document in Firestore
      const sponsorDocRef = doc(firestore, "sponsors", user.uid);
      const sponsorData = {
        sponsorName: values.sponsorName,
        brandName: values.brandName,
        contactPerson: values.contactPerson,
        contactNumber: values.contactNumber,
        email: values.email,
        signupDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
        numberOfGames: 0,
        userId: user.uid,
      };
      
      // Use non-blocking write
      setDocumentNonBlocking(sponsorDocRef, sponsorData, {});
      
      // We don't need to manually create the subcollection, 
      // it will be created when the first document is added to it.

      // 3. Send verification email
      await sendEmailVerification(user, {
        url: `${window.location.origin}/Arena/Munerator/Login`,
      });

      toast({
        title: "Signup Successful!",
        description:
          "A verification email has been sent. Please verify your email before logging in.",
      });

      // 4. Redirect to a verification-pending page
      router.push("/Arena/Munerator/Verify");

    } catch (error: any) {
      console.error("Signup Error:", error);
      toast({
        title: "Signup Failed",
        description:
          error.code === "auth/email-already-in-use"
            ? "This email is already registered. Please log in instead."
            : error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            Become a Munerator
          </CardTitle>
          <CardDescription>
            Create an account to host games and promote your brand.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sponsorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company LLC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="9999999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{" "}
              <Link href="/Arena/Munerator/Login" className="font-semibold text-primary hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
