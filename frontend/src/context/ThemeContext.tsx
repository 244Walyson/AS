"use client";

import { ThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function Theme({ children }: Readonly<ThemeProviderProps>) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
