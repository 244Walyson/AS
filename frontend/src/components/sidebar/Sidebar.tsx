"use client";
import { useState } from "react";
import {
  Home,
  BarChart3,
  Settings,
  X,
  ChevronRight,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "../ui/button";
import { navigate } from "@/app/actions";
import Header from "../header/Header";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "home" },
    { id: "posts", label: "Posts", icon: FileText, path: "posts" },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl lg:shadow-none transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white dark:text-gray-900" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              SentimentAI
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Análise Inteligente
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-auto p-1 h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navegação */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  Dados Protegidos
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Criptografia de ponta a ponta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-0">
        {/* Botão para abrir sidebar no mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <BarChart3 className="w-5 h-5" />
        </Button>

        <Header
          title={sidebarItems.find((x) => x.id === activeSection)?.label || ""}
          subtitle={
            sidebarItems.find((x) => x.id === activeSection)?.label || ""
          }
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {children}
      </div>
    </div>
  );
};

export default Sidebar;
