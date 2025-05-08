import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Camsole - Examination Platform",
    description: "A comprehensive platform for managing examinations",
};

export default function RootLayout({ children }) {
    return ( <
        html lang = "en"
        className = { inter.className } >
        <
        body suppressHydrationWarning >
        <
        AuthProvider >
        <
        ClientLayout > { children } < /ClientLayout>{" "} <
        /AuthProvider>{" "} <
        /body>{" "} <
        /html>
    );
}