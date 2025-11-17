import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "StayHub | Book Your Dream Stay",
  description: "Find and book your perfect stay with StayHub",
  icons: {
    icon: "/new-favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutWrapper>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </LayoutWrapper>
      </body>
    </html>
  );
}
