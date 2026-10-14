"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="py-24 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#0B534B] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm font-semibold text-[#5A6A66]">Redirecting to Dashboard...</p>
    </div>
  );
}
