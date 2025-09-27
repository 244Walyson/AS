import instagramLogo from "@/assets/instagram.svg";
import tiktokLogo from "@/assets/tiktok.svg";
import whatsappLogo from "@/assets/whatsapp.svg";
import { getInstagramAuthUrl } from "@/services/oauth.service";
import { Shield, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";

const socialMeadias = [
  {
    name: "Instagram",
    logo: instagramLogo,
    color:
      "bg-background text-pink-600 border border-pink-600 dark:border-pink-500 dark:text-pink-500 hover:bg-pink-50 dark:hover:bg-background/30",
  },
  {
    name: "TikTok",
    logo: tiktokLogo,
    color:
      "bg-background text-black border border-black dark:border-gray-400 dark:text-white hover:bg-gray-100 dark:hover:bg-background/30",
  },
  {
    name: "WhatsApp",
    logo: whatsappLogo,
    color:
      "bg-background text-green-600 border border-green-600 dark:border-green-500 dark:text-green-500 hover:bg-green-50 dark:hover:bg-background/30",
  },
];

const EmptyState = () => {
  const t = useTranslations("dashboard");

  const handleConnect = (media: string) => {
    if (media === "Instagram") {
      conectarInstagram();
    } else {
      toast.error(t("emptyState.errors.notImplemented"));
    }
  };

  const conectarInstagram = async () => {
    try {
      const authUrl = getInstagramAuthUrl();
      console.log("Redirecting to:", authUrl);
      ///window.open(authUrl, "_self");
      toast.loading(t("emptyState.info.redirecting"));
    } catch {
      toast.error(t("emptyState.errors.instagram"));
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Users className="w-8 h-8 text-gray-400" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t("emptyState.title")}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {t("emptyState.description")}
        </p>

        <div className="flex flex-col items-center gap-2">
          {socialMeadias.map((media) => (
            <Button
              key={media.name}
              className={`h-12 px-6 min-w-[240px] cursor-pointer text-white ${media.color}`}
              onClick={() => handleConnect(media.name)}
            >
              <Image
                src={media.logo}
                alt={media.name}
                className="w-5 h-5 mr-3"
              />
              {t("emptyState.connectButton")} {media.name}
            </Button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {t("emptyState.security.title")}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("emptyState.security.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
