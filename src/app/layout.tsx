import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "C# Learning Portal - Learn C# Programming",
  description: "A comprehensive visual C# learning portal with interactive examples, tutorials and exercises",
  keywords: "C#, programming, learn C#, C# tutorial, coding, .NET",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} min-h-screen font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
              <div className="container mx-auto px-4">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} C# Learning Portal. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
