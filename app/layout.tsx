import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { FeedbackStoreProvider } from "@/store/FeedbackStoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina — Customer Feedback",
  description: "Internal dashboard for reading and filtering customer feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="bg-neutral-50 text-neutral-900 antialiased min-h-screen">
        <FeedbackStoreProvider>{children}</FeedbackStoreProvider>
      </body>
    </html>
  );
}
