
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from "@/app/config";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    if (appConfig.maintenance) {
      router.push("/Arena/Home");
    }
  }, [router]);

  if (appConfig.maintenance) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <MailCheck className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-lg">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            If you don't see the email, please check your spam folder. Once you've verified, you can log in.
          </p>
          <Button asChild className="w-full">
            <Link href="/Arena/Munerator/Login">
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
