import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "HTML Editor with Live Preview & PDF Export",
    description:
        "Edit HTML, CSS, and JavaScript with live preview and PDF export functionality",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  // Force light mode: remove any persisted or system dark preference
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                  localStorage.setItem('theme', 'light');
                  // Prevent any dark mode CSS from applying
                  const style = document.createElement('style');
                  style.textContent = ':root { color-scheme: light !important; }';
                  document.head.appendChild(style);
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
