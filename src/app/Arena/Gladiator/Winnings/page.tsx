"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from "@/app/config";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (appConfig.maintenance) {
      router.push("/Arena/Home");
    }
  }, [router]);

  if (appConfig.maintenance) {
    return null; // or a loading spinner
  }
  
  return <h1>Gladiator Winnings</h1>;
}
