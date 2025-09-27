"use client";
import animationData from "@/assets/animations/Logo.json";
import Lottie from "lottie-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const OauthRedirect = () => {
  const t = useTranslations("dashboard");
  const searchParams = useSearchParams();

  useEffect(() => {
    //toast.loading(t("emptyState.info.redirecting"));

    const code = searchParams.get("code");
    console.log("Authorization Code:", code);
  }, []);

  return (
    <div className="flex justify-center h-screen w-full">
      <Lottie
        animationData={animationData}
        loop={false}
        style={{ marginLeft: "20px", width: 500, height: 200 }}
      />
    </div>
  );
};

export default OauthRedirect;
