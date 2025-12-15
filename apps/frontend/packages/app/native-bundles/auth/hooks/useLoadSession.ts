import { useEffect, useState } from "react";
import { useSessionStore } from 'app/native-bundles/auth/hooks/useSessionStore';
import { useRouter } from "expo-router";
import { API } from "app/bundles/baselib/api";

export const useLoadSession = () => {
    const { session, loadSession, clearSession, createSession } = useSessionStore();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    const handleNoSession = async () => {
        await clearSession()
    }

    const validateSession = async (): Promise<boolean> => {
        const response = await API.get(`/api/v1/auth/validate/token?token=${session?.token}`);
        let isValidSession = true;
        if (!response?.token) { // Probably means that it is an error
            isValidSession = false;
            if (response == 'TokenExpiredError') {
                // Try to refresh session using refreshToken
                if (session?.refreshToken) {
                    const refreshResponse = await API.get(`/api/v1/auth/refresh?token=${session?.refreshToken}`);
                    if (!refreshResponse || refreshResponse?.error) {
                        await handleNoSession();
                    }
                    else {
                        await createSession(refreshResponse); // Update session with refresh token
                        console.log('updated session using refresh token...');
                        isValidSession = true;
                    }
                }
            }
            else {
                // Clear session and redirect to login
                await handleNoSession();
            }
        }
        return isValidSession;
    }

    useEffect(() => {
        if (!ready && !session) {
            // Session Loader
            loadSession()
        }
    }, [session, ready]);

    useEffect(() => {
        // Once retrieved session
        if (session && session?.loggedIn && session?.token) {
            // console.log('DEV: session', session)
            // Check that session is valid
            validateSession().then((isValid) => {
                setReady(true);
                if (isValid) {
                    router.push('/profile')
                } else {
                    router.push('/login')
                }
            });
        }
    }, [session])
}