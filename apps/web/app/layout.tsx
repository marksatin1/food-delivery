import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/context/cart-context";
import { SessionProvider } from "@/context/session-context";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodFrenzy | Food Delivery",
  description: "Order food from the best local restaurants at the speed of light!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <SessionProvider>
          <CartProvider>

            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b bg-white">
              <Navbar />
            </header>

            {/* Page content */}
            <main className="mx-auto max-w-7xl px-4 py-8">
              <Toaster position="top-center" />
              {children}
            </main>

          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}