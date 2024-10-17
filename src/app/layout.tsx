import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Appbar } from "@/components/Appbar";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Socket from "@/components/socket/Socket";
import { QueryClientProvider } from "@/QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIS",
  description: "School Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <Providers>
            <Appbar />
            {children}
            <Toaster />
            <Socket />
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}
