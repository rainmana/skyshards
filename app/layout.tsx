import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { EnvCheck } from "@/components/env-check";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyShards | Aircraft Collection Dashboard",
  description: "Advanced analytics dashboard for SkyCards aircraft collection game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <EnvCheck />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

