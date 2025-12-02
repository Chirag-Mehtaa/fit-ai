import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 👇 Path fix: src folder ke andar dhoondhna hai
import ThemeProvider from "../src/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitAI Coach",
  description: "AI powered workout generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 👇 YAHAN HAI MAGIC: Light mode me gray, Dark me black */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}