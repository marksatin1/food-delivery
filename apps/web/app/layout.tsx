import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodDash | Food Delivery",
  description: "Order food from the best local restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        
        {/* Navigation */}
        <header className="sticky top-0 z-50 border-b bg-white">
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold text-red-600">
              FoodDash
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium hover:text-red-600">
                Restaurants
              </Link>
            </div>
          </nav>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-7xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}