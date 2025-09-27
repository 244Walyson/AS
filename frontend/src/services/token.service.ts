import { AccessTokenType } from "@/@types/access-token.type";

export const storeToken = (accessToken: AccessTokenType) => {
  localStorage.setItem("accessToken", accessToken.access_token);
  localStorage.setItem("expiresIn", accessToken.expires_in.toString());
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getStoredExpiresIn = (): string | null => {
  return localStorage.getItem("expiresIn");
};

export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("expiresIn");
};
