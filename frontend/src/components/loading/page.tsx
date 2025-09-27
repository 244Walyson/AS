"use client";
import animationData from "@/assets/animations/Logo.json";
import Lottie from "lottie-react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full ">
      <Lottie
        animationData={animationData}
        loop={false}
        style={{ marginLeft: "40px", width: 500, height: 500 }}
      />
    </div>
  );
};

export default LoadingPage;
