import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationProvider } from "@/components/location-provider";
import { PredictionProvider } from "@/components/prediction-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HetEvoAgent — Air Quality Management",
  description:
    "Monitor air quality, predict pollution trends, analyze environmental data, and receive AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LocationProvider>
            <PredictionProvider>
              {children}
            </PredictionProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}