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
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center">
              <CloudSun size={32} className="text-blue-400 sm:w-12 sm:h-12" />
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">Weather App</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
              {user && (
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
                  {user.picture && <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />}
                  <span className="text-white text-sm">{user.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              placeholder="Enter a city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 sm:px-6 py-3 bg-slate-800/80 text-white rounded-lg border-2 border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-500 text-sm sm:text-base"
            />
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base">
              Add City
            </button>
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
    <div
      onClick={onClick}
      className="weather-card bg-slate-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl cursor-pointer relative active:scale-100"
    >
      <div className={`bg-gradient-to-br ${getWeatherColor(mainStatus)} p-6 sm:p-8 relative overflow-hidden`}>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-black/10 rounded-full -mb-16 -ml-16 sm:-mb-24 sm:-ml-24"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 bg-black/10 rounded-full -mb-20 -mr-20 sm:-mb-28 sm:-mr-28"></div>
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mt-12 -mr-12 sm:-mt-16 sm:-mr-16"></div>

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {weather.name || weather.cityName}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mb-6 sm:mb-8">
            {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              month: 'short',
              day: 'numeric'
            })}
          </p>

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="text-white flex-shrink-0">{getWeatherIcon(mainStatus, 40)}</div>
              <div className="min-w-0">
                <p className="text-white text-xs sm:text-base font-medium truncate">
                  {description
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-3xl sm:text-5xl font-bold text-white mb-1 sm:mb-2">{temp}°C</div>
              <div className="text-white/90 text-[10px] sm:text-sm space-y-0.5">
                <p>Temp Min: {tempMin}°c</p>
                <p>Temp Max: {tempMax}°c</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 p-3 sm:p-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-white">
          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <p className="text-white/60 text-[10px] sm:text-xs mb-0.5">Pressure:</p>
              <p className="font-semibold text-xs sm:text-sm">{pressure}hPa</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] sm:text-xs mb-0.5">Humidity:</p>
              <p className="font-semibold text-xs sm:text-sm">{humidity}%</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] sm:text-xs mb-0.5">Visibility:</p>
              <p className="font-semibold text-xs sm:text-sm">{visibility}km</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: `rotate(${windDegree}deg)` }}>
              <path d="M12 2l-4 8h8l-4-8z" fill="currentColor"/>
              <line x1="12" y1="10" x2="12" y2="22" />
            </svg>
            <p className="font-semibold text-[10px] sm:text-sm text-center leading-tight">{windSpeed.toFixed(1)}m/s</p>
            <p className="font-semibold text-[10px] sm:text-sm text-center leading-tight">{windDegree} Degree</p>
          </div>

          <div className="space-y-2 text-right text-xs sm:text-sm">
            <div>
              <p className="text-white/60 text-[10px] sm:text-xs mb-0.5">Sunrise:</p>
              <p className="font-semibold text-xs sm:text-sm">{sunrise}</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] sm:text-xs mb-0.5">Sunset:</p>
              <p className="font-semibold text-xs sm:text-sm">{sunset}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
