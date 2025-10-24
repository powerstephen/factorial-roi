import "./globals.css";
import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";

// ✅ Add explicit weights
const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],   // regular + semibold
  display: "swap",
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "Factorial ROI Calculator",
  description: "Estimate payback, savings and ROI for Factorial HR.",
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
