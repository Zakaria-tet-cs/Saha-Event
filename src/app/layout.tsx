import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Saha-Event | Luxe & Prestige à Alger",
  description: "Réservez les salles les plus prestigieuses d'Alger pour vos moments d'exception.",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth scroll-pt-20">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-beige min-h-screen flex flex-col relative`}>
        <AuthProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}
