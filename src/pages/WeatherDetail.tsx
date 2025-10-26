import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudSun, Sunrise } from 'lucide-react';
import { CityWeatherDto, weatherApi, withAuth } from '../services/api';
import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';
import { useAuth0 } from '@auth0/auth0-react';
import { WeatherAnimation } from '../components/WeatherAnimations';

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

  const mainStatus = weather.staticStatus;
  const description = weather.description || '';
  const temp = Math.round(weather.temp);
  const tempMin = weather.temp_min ? Math.round(weather.temp_min) : temp - 2;
  const tempMax = weather.temp_max ? Math.round(weather.temp_max) : temp + 3;
  const humidity = weather.humidity || 0;
  const windSpeed = weather.wind_speed || 0;
  const windDegree = weather.wind_deg || 120;
  const pressure = weather.pressure || 1018;
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : '8.0';
  const sunrise = weather.sunrise || 'undefined';
  const sunset = weather.sunset || 'undefined';

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
            <div className={`bg-gradient-to-br ${getWeatherColor(mainStatus)} p-8 sm:p-12 relative overflow-hidden`}>
              <WeatherAnimation status={mainStatus} />
              <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-black/10 rounded-full -mb-24 -ml-24 sm:-mb-32 sm:-ml-32"></div>
              <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-black/10 rounded-full -mb-28 -mr-28 sm:-mb-36 sm:-mr-36"></div>
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full -mt-16 -mr-16 sm:-mt-20 sm:-mr-20"></div>

              <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full text-white transition-all backdrop-blur-sm z-50 touch-manipulation"
              >
                <ArrowLeft size={24} />
              </button>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {weather.name}
                </h2>
                <p className="text-white/90 text-sm sm:text-base mb-8 sm:mb-12">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                <div className="flex items-center justify-center gap-12 mb-8">
                  <div className="text-white">
                    {getWeatherIcon(mainStatus, 80)}
                  </div>
                  <p className="text-white text-xl sm:text-2xl font-medium">
                    {description
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </p>
                  <div className="h-20 w-px bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-6xl sm:text-7xl font-bold text-white mb-2">
                      {temp}°C
                    </div>
                    <div className="text-white/90 text-sm sm:text-base space-y-1">
                      <p>Temp Min: {tempMin}°c</p>
                      <p>Temp Max: {tempMax}°c</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 sm:p-8">
              <div className="grid grid-cols-3 gap-6 text-white">
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Pressure:</p>
                    <p className="font-semibold text-base">{pressure}hPa</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Humidity:</p>
                    <p className="font-semibold text-base">{humidity}%</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Visibility:</p>
                    <p className="font-semibold text-base">{visibility}km</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: `rotate(${windDegree}deg)` }}>
                    <path d="M12 2l-4 8h8l-4-8z" fill="currentColor"/>
                    <line x1="12" y1="10" x2="12" y2="22" />
                  </svg>
                  <p className="font-semibold text-base">{windSpeed.toFixed(1)}m/s {windDegree} Degree</p>
                </div>

                <div className="space-y-3 text-right">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Sunrise:</p>
                    <p className="font-semibold text-base">{sunrise}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Sunset:</p>
                    <p className="font-semibold text-base">{sunset}</p>
                  </div>
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
