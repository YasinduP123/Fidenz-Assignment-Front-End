import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun } from 'lucide-react';
import { WeatherData } from '../services/weatherService';

interface DashboardProps {
  weatherData: WeatherData[];
  loading: boolean;
  error: string | null;
}

export const Dashboard = ({ weatherData, loading, error }: DashboardProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardClick = (cityId: number) => {
    navigate(`/weather/${cityId}`);
  };

  const filteredWeather = weatherData.filter(weather =>
    weather.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <CloudSun size={48} className="text-blue-400" />
            <h1 className="text-5xl font-bold text-white">Weather App</h1>
          </div>

          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              placeholder="Enter a city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg border-2 border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-slate-500"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all shadow-lg">
              Add City
            </button>
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
              <p className="text-white text-xl">Loading weather data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-200 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && filteredWeather.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {filteredWeather.map((weather) => (
              <DashboardWeatherCard
                key={weather.id}
                weather={weather}
                onClick={() => handleCardClick(weather.id)}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredWeather.length === 0 && weatherData.length > 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-xl">No cities found matching "{searchQuery}"</p>
          </div>
        )}

        <footer className="text-center mt-16 pb-8">
          <p className="text-slate-500 text-sm">2021 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
};

import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';

interface DashboardWeatherCardProps {
  weather: WeatherData;
  onClick: () => void;
}

const DashboardWeatherCard = ({ weather, onClick }: DashboardWeatherCardProps) => {
  const mainStatus = weather.weather[0].main;
  const description = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const tempMin = Math.round(weather.main.temp_min);
  const tempMax = Math.round(weather.main.temp_max);

  const formatDescription = (desc: string) => {
    return desc.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div
      onClick={onClick}
      className="weather-card bg-slate-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl cursor-pointer relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-slate-900/50 hover:bg-slate-900 rounded-full text-white transition-colors"
      >
        <span className="text-xl leading-none">×</span>
      </button>

      <div className={`bg-gradient-to-br ${getWeatherColor(mainStatus)} p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="absolute inset-0 transform scale-150">
            {getWeatherIcon(mainStatus, 256)}
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-1">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-white/80 text-sm mb-6">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              month: 'short',
              day: 'numeric'
            })}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white">
                {getWeatherIcon(mainStatus, 48)}
              </div>
              <div>
                <p className="text-white text-lg font-medium">{formatDescription(description)}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-6xl font-bold text-white mb-2">
                {temp}°C
              </div>
              <div className="text-white/90 text-sm space-y-1">
                <p>Temp Min: {tempMin}°C</p>
                <p>Temp Max: {tempMax}°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm p-6">
        <div className="grid grid-cols-3 gap-6 text-white/90 text-sm">
          <div>
            <p className="text-xs text-white/60 mb-1">Pressure:</p>
            <p className="font-semibold">{weather.main.pressure}hPa</p>
            <p className="text-xs text-white/60 mt-2 mb-1">Humidity:</p>
            <p className="font-semibold">{weather.main.humidity}%</p>
            <p className="text-xs text-white/60 mt-2 mb-1">Visibility:</p>
            <p className="font-semibold">{(weather.visibility / 1000).toFixed(1)}km</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-bold">{weather.wind.speed.toFixed(1)}m/s</p>
            <p className="text-xs text-white/60">{weather.wind.deg} Degree</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-white/60 mb-1">Sunrise:</p>
            <p className="font-semibold">
              {new Date((weather.sys_sunrise || 0) * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
            <p className="text-xs text-white/60 mt-2 mb-1">Sunset:</p>
            <p className="font-semibold">
              {new Date((weather.sys_sunset || 0) * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
