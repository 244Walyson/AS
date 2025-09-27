import axiosInstance from "@/services/interceptor";
import { jwtDecode } from "jwt-decode";
import { storeUserID } from "@/services/user.service";
import { storeToken } from "@/services/token.service";
import { CredentialsType } from "@/@types/creadentials.type";
import { AccessTokenType } from "@/@types/access-token.type";

export const resetPassword = async (
  email: string,
  token: string,
  password: string
): Promise<void> => {
  try {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    const response = await axiosInstance.post("/auth/reset-password", {
      email,
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error("Failed to reset password. Please try again later.");
  }
};

export const getAccessToken = async (credentials: CredentialsType) => {
  try {
    const response = await axiosInstance.post(`/auth/token`, credentials);
    const accessToken = response.data;
    storeToken(accessToken);
    const decoded = decodeAccessToken(accessToken.access_token);
    if (decoded) {
      storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post(`/auth/token/refresh`);
    const accessToken = response.data;
    storeToken(accessToken);
    const decoded = decodeAccessToken(accessToken.access_token);
    if (decoded) {
      storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getRecoverPasswordToken = async (username: string) => {
  try {
    const response = await axiosInstance.post(
      `/users/reset-password/request`,
      { username }
    );
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getAccessTokenWithGoogleToken = async (
  authorizationCode: string
): Promise<AccessTokenType> => {
  try {
    const data = {
      authorization_code: authorizationCode,
    } satisfies CredentialsType;
    const response = await axiosInstance.post(`/auth/google`, data);
    const accessToken = response.data;
    storeToken(accessToken);
    const decoded = decodeAccessToken(accessToken.access_token);
    if (decoded) {
      storeUserID(decoded.sub);
    }
    return accessToken;
  } catch (error) {
    console.error("Erro ao enviar tokens para o backend:", error);
    throw error;
  }
};

interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

export function decodeAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar o token", error);
    return null;
  }
}
