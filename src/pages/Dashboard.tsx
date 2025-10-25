import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { weatherApi, CityWeatherDto, withAuth } from '../services/api';
import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user, getAccessTokenSilently } = useAuth0();

  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<CityWeatherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await withAuth(
        () => weatherApi.getAllCitiesWeather(),
        async () => getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } })
      );

      if (response.success) {
        setWeatherData(response.data || []);
        console.log('Weather data:', response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (cityCode: string | number) => {
    navigate(`/weather/${cityCode}`);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const filteredWeather = weatherData.filter(weather =>
    (weather.name || weather.cityName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 relative">
            <CloudSun size={36} className="text-blue-400 sm:w-12 sm:h-12" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Weather App</h1>

            <div className="absolute right-0 top-0 flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
                  {user.picture && <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />}
                  <span className="text-white text-sm">{user.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-6 py-3 bg-slate-800 text-white rounded-lg border-2 border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-500 text-sm sm:text-base"
            />
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
              <p className="text-white text-xl">Loading weather data...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-200 text-lg">{error}</p>
            <button
              onClick={fetchWeatherData}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Weather Cards */}
        {!loading && !error && filteredWeather.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {filteredWeather.map((w) => (
              <DashboardWeatherCard
                key={w.cityCode || w.name}
                weather={w}
                onClick={() => handleCardClick(w.cityCode || 0)}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredWeather.length === 0 && weatherData.length > 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-slate-400 text-lg sm:text-xl">
              No cities found matching "{searchQuery}"
            </p>
          </div>
        )}

        <footer className="text-center mt-12 sm:mt-16 pb-6 sm:pb-8">
          <p className="text-slate-500 text-xs sm:text-sm">2021 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
};

interface DashboardWeatherCardProps {
  weather: CityWeatherDto;
  onClick: () => void;
}

const DashboardWeatherCard = ({ weather, onClick }: DashboardWeatherCardProps) => {
  const mainStatus = weather.staticStatus || 'Clear';
  const description = weather.description || '';
  const temp = Math.round(weather.temp);
  const feelsLike = weather.feels_like ? Math.round(weather.feels_like) : undefined;
  const humidity = weather.humidity || 0;
  const windSpeed = weather.wind_speed || 0;

  return (
    <div
      onClick={onClick}
      className="weather-card bg-slate-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl cursor-pointer relative active:scale-100"
    >
      <div className={`bg-gradient-to-br ${getWeatherColor(mainStatus)} p-4 sm:p-6 lg:p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 opacity-10">
          <div className="absolute inset-0 transform scale-150">{getWeatherIcon(mainStatus, 256)}</div>
        </div>

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
            {weather.name || weather.cityName}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              month: 'short',
              day: 'numeric'
            })}
          </p>

          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-white">{getWeatherIcon(mainStatus, 40)}</div>
              <div>
                <p className="text-white text-sm sm:text-base lg:text-lg font-medium">
                  {description
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1">{temp}°C</div>
              <div className="text-white/90 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                <p>Feels like: {feelsLike ? `${feelsLike}°C` : '—'}</p>
                <p>Humidity: {humidity}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm p-4 sm:p-6">
        <div className="flex items-center justify-between text-white/90 text-xs sm:text-sm gap-4">
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs text-white/60">Humidity</p>
            <p className="font-semibold">{humidity}%</p>
          </div>

          <div className="flex-1 text-center">
            <p className="text-[10px] sm:text-xs text-white/60">Wind</p>
            <p className="font-semibold">{windSpeed.toFixed(1)} m/s</p>
          </div>

          <div className="flex-1 text-right">
            <p className="text-[10px] sm:text-xs text-white/60">Cached</p>
            <p className="font-semibold">{weather.cached ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
