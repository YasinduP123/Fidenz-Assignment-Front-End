import { Navigation } from 'lucide-react';
import { WeatherData } from '../services/weatherService';
import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
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

  const sunrise = new Date((weather.sys_sunrise || 0) * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const sunset = new Date((weather.sys_sunset || 0) * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="weather-card bg-slate-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
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
                {getWeatherIcon(mainStatus, 64)}
              </div>
              <div>
                <p className="text-white text-xl font-medium">{formatDescription(description)}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-7xl font-bold text-white mb-2">
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
        <div className="grid grid-cols-3 gap-6 text-white/90">
          <div>
            <p className="text-xs text-white/60 mb-1">Pressure:</p>
            <p className="font-semibold">{weather.main.pressure}hPa</p>
            <p className="text-xs text-white/60 mt-2 mb-1">Humidity:</p>
            <p className="font-semibold">{weather.main.humidity}%</p>
            <p className="text-xs text-white/60 mt-2 mb-1">Visibility:</p>
            <p className="font-semibold">{(weather.visibility / 1000).toFixed(1)}km</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Navigation
              size={32}
              className="text-white/80 mb-2"
              style={{ transform: `rotate(${weather.wind.deg}deg)` }}
            />
            <p className="text-lg font-bold">{weather.wind.speed.toFixed(1)}m/s</p>
            <p className="text-sm text-white/60">{weather.wind.deg} Degree</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-white/60 mb-1">Sunrise:</p>
            <p className="font-semibold">{sunrise}</p>
            <p className="text-xs text-white/60 mt-2 mb-1">Sunset:</p>
            <p className="font-semibold">{sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
