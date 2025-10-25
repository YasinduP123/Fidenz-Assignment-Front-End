const AUTH_BASE = import.meta.env.VITE_AUTH_BASE || '/api/auth';

export const authService = {
    // Redirects browser to backend which starts Auth0 authorize (code) flow.
    login(returnTo?: string) {
        const target = returnTo || window.location.pathname + window.location.search;
        window.location.href = `${AUTH_BASE}/login?returnTo=${encodeURIComponent(target)}`;
    },

    // Calls backend to clear HttpOnly cookie and redirects to login page
    async logout() {
        try {
            await fetch(`${AUTH_BASE}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            // ignore network errors here
            console.error('Logout failed', err);
        } finally {
            window.location.href = '/login';
        }
    },

    // Fetch current user from backend; backend reads HttpOnly cookie and validates token.
    async getProfile(): Promise<{ sub: string; name?: string; picture?: string } | null> {
        try {
            const res = await fetch(`${AUTH_BASE}/me`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) return null;
            return await res.json();
        } catch (err) {
            console.error('getProfile error', err);
            return null;
        }
    }
};
