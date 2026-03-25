import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ef-inter",
  display: "swap",
});

const ibm = IBM_Plex_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ef-ibm",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-ef-jet",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BMS 4.0 Percolation Engine | Executive Function OS",
  description:
    "Client-side percolation and DBSCAN analysis of Google Drive activity metadata for cognitive network research.",
};

export default function EngineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${inter.variable} ${ibm.variable} ${jetbrains.variable} min-h-screen font-sans antialiased`}
      style={{
        fontFamily: "var(--font-ef-inter), ui-sans-serif, system-ui",
      }}
    >
      <style>{`
        .ef-heading { font-family: var(--font-ef-ibm), ui-sans-serif, system-ui; }
        .ef-mono { font-family: var(--font-ef-jet), ui-monospace, monospace; }
      `}</style>
      {children}
    </div>
  );
}
