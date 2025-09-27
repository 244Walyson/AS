import { CredentialsType } from "@/@types/creadentials.type";
import axiosInstance from "@/services/interceptor";

export const saveInstagramCredentials = async (authorizationCode: string) => {
  try {
    const data = {
      authorization_code: authorizationCode,
    } satisfies CredentialsType;
    const response = await axiosInstance.post(`/instagram/credentials`, data);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getInstagramAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;
  const scope = process.env.NEXT_PUBLIC_INSTAGRAM_SCOPE;
  const authUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  if (!clientId || !redirectUri || !authUrl) {
    throw new Error("Missing Instagram OAuth configuration");
  }

  console.log({ clientId, redirectUri, scope, authUrl });

  const url = new URL(authUrl);

  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("scope", scope || "");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("force_reauth", "true");

  return url.toString();
};
