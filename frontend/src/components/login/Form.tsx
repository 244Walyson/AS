"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  BarChart3,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  getAccessToken,
  getAccessTokenWithGoogleToken,
  getRecoverPasswordToken,
} from "@/services/auth.service";
import { UserType } from "@/@types/user.type";
import { createUser } from "@/services/user.service";
import { useGoogleLogin } from "@react-oauth/google";

enum OperationEnum {
  LOGIN = "Entrar",
  RECOVER_PASSWORD = "Recuperar Senha",
  REGISTER = "Registrar-se",
}

const FormLogin = () => {
  const t = useTranslations("login");
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [operation, setOperation] = React.useState<OperationEnum>(
    OperationEnum.LOGIN
  );
  const [formData, setFormData] = React.useState<UserType>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email) return;
    if (operation === OperationEnum.LOGIN) {
      getAccessToken({
        username: formData.email,
        password: formData.password,
      });
    }
    if (operation === OperationEnum.RECOVER_PASSWORD) {
      getRecoverPasswordToken(formData.email);
    }
    if (operation === OperationEnum.REGISTER) {
      createUser(formData);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => {
      const googleAccessToken = response.access_token;
      getAccessTokenWithGoogleToken(googleAccessToken);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <div className="w-ful l min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center gap-12">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white dark:text-gray-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("brand.title")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("brand.subtitle")}
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {t("hero.title")}{" "}
              <span className="text-gray-600 dark:text-gray-300">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {t("hero.description")}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t("features.accuracy.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("features.accuracy.description")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t("features.security.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("features.security.description")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t("features.realTime.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("features.realTime.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-2xl font-bold">{t("stats.free")}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("stats.freeDescription")}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{t("stats.setup")}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("stats.setupDescription")}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("stats.monitoring")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-96">
          <Card className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <BarChart3 className="w-8 h-8 text-white dark:text-gray-900" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {operation === OperationEnum.REGISTER
                    ? t("form.loginTitle")
                    : t("form.registerTitle")}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {operation === OperationEnum.REGISTER
                    ? t("form.loginDescription")
                    : t("form.registerDescription")}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {operation === OperationEnum.REGISTER && (
                  <>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                        type="text"
                        placeholder={t("form.placeholders.fullName")}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                        type="text"
                        placeholder={t("form.placeholders.username")}
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                    type="email"
                    placeholder={t("form.placeholders.email")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {operation !== OperationEnum.RECOVER_PASSWORD && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white transition-colors"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder={t("form.placeholders.password")}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {isPasswordVisible ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() =>
                      setOperation(
                        operation !== OperationEnum.LOGIN
                          ? OperationEnum.LOGIN
                          : OperationEnum.RECOVER_PASSWORD
                      )
                    }
                  >
                    {operation === OperationEnum.RECOVER_PASSWORD ||
                    operation === OperationEnum.REGISTER
                      ? t("form.actions.backToLogin")
                      : t("form.actions.forgotPassword")}
                  </button>
                </div>

                {/* Main Action Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium transition-colors"
                >
                  {operation}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-gray-500 bg-white dark:bg-gray-800">
                      {t("form.actions.continueWith")}
                    </span>
                  </div>
                </div>

                {/* Google Login */}
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleGoogleLogin}
                >
                  <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  Google
                </Button>

                {/* Register Link */}
                {operation !== OperationEnum.REGISTER && (
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    {t("form.actions.noAccount")}{" "}
                    <button
                      onClick={() => setOperation(OperationEnum.REGISTER)}
                      className="text-gray-900 dark:text-white hover:underline font-medium transition-colors"
                    >
                      {t("form.actions.createAccount")}
                    </button>
                  </p>
                )}
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t("form.security.notice")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Benefits */}
          <div className="lg:hidden flex justify-center gap-6 mt-8 text-center">
            <div>
              <div className="text-xl font-bold">Gratuito</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                para começar
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">5 min</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                configuração
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">24/7</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                monitoramento
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
