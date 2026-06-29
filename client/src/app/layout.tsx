import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gore Woreda — Official Municipal Portal",
  description:
    "Official website of the Gore Woreda Administration, Illubabor Zone, Oromia, Ethiopia. Access municipal services, news, documents, and public information.",
  keywords: [
    "Gore Woreda",
    "Gore Municipality",
    "Illubabor",
    "Oromia",
    "Ethiopia",
    "municipal services",
    "government",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking script to prevent FOUC — sets .dark class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('gore_theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
