import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster"; // Tambahkan ini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportsBook - Sports Field Booking",
  description: "Book your favorite sports fields easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster /> {/* Penting: letakkan di luar ThemeProvider agar toast muncul di semua halaman */}
        </ThemeProvider>
      </body>
    </html>
  );
}
