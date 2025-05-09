// Removed Google Font import due to build failure when offline
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "@/contexts/AuthContext";


export const metadata = {
    title: "Camsole - Examination Platform",
    description: "A comprehensive platform for managing examinations",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
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