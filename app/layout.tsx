import "./globals.css";
import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "Factorial ROI Calculator",
  description: "Estimate payback, savings and ROI for Factorial HR.",
  icons: {
    icon: "/favicon.jpg", // ✅ your jpeg favicon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fira.variable}>
      <body className="bg-white text-factorial-ink antialiased">
        {children}
      </body>
    </html>
  );
}
