import type { Metadata } from "next";
import "./globals.css";
import CodeDripBackground from "@/components/CodeDripBackground";
import NavbarWrapper from "@/components/NavbarWrapper";

const outfitVariable = "font-outfit";
const jetbrainsMonoVariable = "font-jetbrains-mono";

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
        <html lang="en" className={`${outfitVariable} ${jetbrainsMonoVariable}`} suppressHydrationWarning>
            <body>
                <CodeDripBackground />
                <NavbarWrapper />
                {children}
            </body>
        </html>
    );
}
