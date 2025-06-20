import type { Metadata } from "next";
import { Mona_Sans} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inprep",
  description: "AI Powered Mock Interview Platform",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.variable} antialiased pattern`}
      >
        {children}
        <Toaster></Toaster>
      </body>
    </html>
  );
}
