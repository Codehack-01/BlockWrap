import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "BlockWrap | Your SOL Transactions Tracker",
  description: "Visualize your Solana blockchain activity and track expenses in real-time.",
  openGraph: {
    images: ["/blockbanner.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/blockbanner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Space+Grotesk:wght@300..700&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('blockwrap-theme') || 'dark';
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.add(systemTheme);
                } else {
                  document.documentElement.classList.add(theme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
        <ThemeProvider>
          {children}
          <Analytics />
          <SpeedInsights/>
        </ThemeProvider>
      </body>
    </html>
  );
}