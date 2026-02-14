import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CodeDripBackground from "@/components/CodeDripBackground";
import NavbarWrapper from "@/components/NavbarWrapper";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Verstige | The Private Operating System for Visionaries",
    description: "High-performance ecosystem for elite digital execution.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <body>
                <CodeDripBackground />
                <NavbarWrapper />
                {children}
            </body>
        </html>
    );
}
