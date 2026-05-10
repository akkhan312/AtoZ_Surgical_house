import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Atoz Surgical House - Trusted Surgical & Medical Equipment",
  description: "Shop professional surgical supplies, BP sets, stethoscopes, glucometers and more at Atoz Surgical House.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Inter,sans-serif] antialiased">
        <AppProvider>
          <div className="app-shell">
            <Navbar />
            <main className="web-main">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
