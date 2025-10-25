import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud } from 'lucide-react';

export default function Login() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Cloud className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Weather App</h1>
          <p className="text-white/80 text-lg">
            Your personal weather companion
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Welcome
          </h2>

          <p className="text-white/90 mb-8 text-center">
            Sign in to access real-time weather information for cities around the world
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-white hover:bg-white/90 text-slate-900 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Sign In with Auth0
          </button>

          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">100+</div>
                <div className="text-white/70 text-sm">Cities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Real-time</div>
                <div className="text-white/70 text-sm">Updates</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Secure</div>
                <div className="text-white/70 text-sm">Auth0</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/60 text-sm text-center mt-6">
          Powered by OpenWeather API & Spring Boot
        </p>
      </div>
    </div>
  );
}
