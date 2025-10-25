import { Navigation } from 'lucide-react';
import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';
import { CityWeatherDto } from '../services/api';

interface WeatherCardProps {
  weather: CityWeatherDto;
  onClick?: () => void;
}

export const WeatherCard = ({ weather, onClick }: WeatherCardProps) => {
  const mainStatus = weather.staticStatus || 'Clear';
  const description = weather.description || '';
  const temp = Math.round(weather.temp);
  const windSpeed = weather.wind_speed || 0;
  const humidity = weather.humidity || 0;

  return (
    <div onClick={onClick} className="weather-card max-w-md w-full mx-auto bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className={`${getWeatherColor(mainStatus)} p-6 relative`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{weather.name}</h3>
            <p className="text-sm text-white/80 mt-1">
              {new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-white">{temp}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-white">
            {getWeatherIcon(mainStatus, 48)}
          </div>
          <p className="text-lg font-medium text-white capitalize">{description}</p>
        </div>
      </div>

      <div className="bg-slate-900/30 p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-white/60 mb-1">Pressure</p>
              <p className="text-sm font-semibold text-white">1,012 hPa</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Humidity</p>
              <p className="text-sm font-semibold text-white">{humidity}%</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Visibility</p>
              <p className="text-sm font-semibold text-white">8.0 km</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-700/30 px-4">
            <Navigation 
              className="text-white/80 mb-2" 
              size={28} 
              style={{ 
                transform: `rotate(${weather.wind_degree || 0}deg)`,
                transition: 'transform 0.3s ease-in-out'
              }} 
            />
            <p className="text-sm font-semibold text-white">{windSpeed} m/s</p>
            <p className="text-xs text-white/60">{weather.wind_degree || 0}°</p>
          </div>

          <div className="text-right space-y-3">
            <div>
              <p className="text-xs text-white/60 mb-1">Sunrise</p>
              <p className="text-sm font-semibold text-white">6:05</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Sunset</p>
              <p className="text-sm font-semibold text-white">18:57</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
