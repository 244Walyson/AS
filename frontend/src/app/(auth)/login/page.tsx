"use client";
import LoadingPage from "@/components/loading/page";
import LoginContainer from "@/components/login/LoginContainer";
import { useEffect, useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full">
        {loading ? <LoadingPage /> : <LoginContainer />}
      </div>
    </div>
  );
}
