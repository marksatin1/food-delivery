import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { CartButton } from "@/components/cart-button";

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
        <CartProvider>
          
          {/* Navigation */}
          <header className="sticky top-0 z-50 border-b bg-white">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
              <Link href="/" className="text-2xl font-bold text-red-600">
                FoodFrenzy
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-lg font-medium hover:text-red-600">
                  Restaurants
                </Link>
                <CartButton />
              </div>
            </nav>
          </header>

          {/* Page content */}
          <main className="mx-auto max-w-7xl px-4 py-8">
            {children}
          </main>

        </CartProvider>
      </body>
    </html>
  );
}