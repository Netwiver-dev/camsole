import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Camsole",
    description: "School management website",
    icons: {
        icon: "/images/camsole-logo.png",
    },
};

export default function RootLayout({ children }) {
    return ( <
        html lang = "en"
        className = { `${geistSans.variable} ${geistMono.variable}` }
        suppressHydrationWarning >
        <
        body >
        <
        AuthProvider >
        <
        ClientLayout > { children } <
        /ClientLayout> < /
        AuthProvider > <
        /body> < /
        html >
    );
}