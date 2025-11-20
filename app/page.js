"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.push("/dashboard");
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your task management system</p>
      </div>
    </div>
  );
}
