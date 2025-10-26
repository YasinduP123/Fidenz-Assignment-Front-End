import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

interface Auth0ProviderWithNavigateProps {
    children: React.ReactNode;
}

export const Auth0ProviderWithNavigate: React.FC<Auth0ProviderWithNavigateProps> = ({
    children,
}) => {
    const navigate = useNavigate();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE!;
    const redirectUri = window.location.origin;

    const onRedirectCallback = (appState?: { returnTo?: string }) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                audience: audience,
                scope: "openid profile email offline_access",
            }}
            onRedirectCallback={onRedirectCallback}
            useRefreshTokens={true}
            cacheLocation="localstorage"
            useRefreshTokensFallback={true}
        >
            {children}
        </Auth0Provider>
    );
};