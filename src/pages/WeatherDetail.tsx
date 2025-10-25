import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudSun } from 'lucide-react';
import { CityWeatherDto, weatherApi, withAuth } from '../services/api';
import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';
import { useAuth0 } from '@auth0/auth0-react';

export const WeatherDetail = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [weather, setWeather] = useState<CityWeatherDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherDetail = async () => {
      if (!cityId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await withAuth(
          () => weatherApi.getWeatherByCity(cityId),
          async () =>
            getAccessTokenSilently({
              authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
            })
        );

        if (response.success) {
          setWeather(response.data);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error('Error loading weather details:', err);
        setError(err.response?.data?.message || 'Failed to load weather details');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherDetail();
  }, [cityId, getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
          <p className="text-white text-lg sm:text-xl">Loading weather details...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-red-200 text-base sm:text-lg mb-4">{error || 'Weather data not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const mainStatus = weather.staticStatus || 'Clear';
  const description = weather.description || '';
  const temp = Math.round(weather.temp);
  const feelsLike = weather.feels_like ? Math.round(weather.feels_like) : undefined;
  const humidity = weather.humidity || 0;
  const windSpeed = weather.wind_speed || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <CloudSun size={36} className="text-blue-400 sm:w-12 sm:h-12" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Weather App</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-br ${getWeatherColor(mainStatus)} p-6 sm:p-8 lg:p-12 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 opacity-10">
                <div className="absolute inset-0 transform scale-150">
                  {getWeatherIcon(mainStatus, 384)}
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="absolute top-3 left-3 sm:top-6 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full text-white transition-all backdrop-blur-sm z-50 touch-manipulation"
              >
                <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="relative z-10 text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                  {weather.name}
                </h2>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-12">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
                  <div className="text-white">
                    {getWeatherIcon(mainStatus, 64)}
                  </div>
                  <div className="hidden sm:block h-20 lg:h-32 w-px bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-2 sm:mb-4">
                      {temp}°C
                    </div>
                    <p className="text-white text-lg sm:text-xl lg:text-2xl font-medium mb-2">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-8 sm:gap-12 lg:gap-16 text-white/90">
                  <div>
                    <p className="text-white/70 mb-1">Feels Like</p>
                    <p className="font-semibold text-xl sm:text-2xl">
                      {feelsLike ? `${feelsLike}°C` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 mb-1">Humidity</p>
                    <p className="font-semibold text-xl sm:text-2xl">{humidity}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm p-4 sm:p-8 lg:p-12">
              <div className="flex items-center justify-between text-white/90 gap-4">
                <div className="flex-1">
                  <p className="text-sm text-white/60">Humidity</p>
                  <p className="font-semibold text-lg">{humidity}%</p>
                </div>

                <div className="flex-1 text-center">
                  <p className="text-sm text-white/60">Wind Speed</p>
                  <p className="font-semibold text-lg">{windSpeed.toFixed(1)} m/s</p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-sm text-white/60">Cached</p>
                  <p className="font-semibold text-lg">{weather.cached ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 sm:mt-16 pb-6 sm:pb-8">
          <p className="text-slate-500 text-xs sm:text-sm">2021 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
};
