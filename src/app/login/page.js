import { AuthProvider } from "../../lib/auth-context";
import LoginClient from "./page-client";
import LoginWrapper from './login-wrapper';

export default function LoginPage() {
    return ( <
        AuthProvider >
        <
        LoginWrapper / >
        <
        /AuthProvider>
    );
}