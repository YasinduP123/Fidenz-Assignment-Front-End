import { Cloud, CloudRain, CloudSnow, CloudDrizzle, Sun, CloudFog, Wind } from 'lucide-react';

export const getWeatherIcon = (status: string, size: number = 48) => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('rain') || statusLower.includes('drizzle')) {
    return <CloudRain size={size} className="weather-icon" />;
  }
  if (statusLower.includes('clouds')) {
    return <Cloud size={size} className="weather-icon" />;
  }
  if (statusLower.includes('clear') || statusLower.includes('sun')) {
    return <Sun size={size} className="weather-icon" />;
  }
  if (statusLower.includes('snow')) {
    return <CloudSnow size={size} className="weather-icon" />;
  }
  if (statusLower.includes('mist') || statusLower.includes('fog') || statusLower.includes('haze')) {
    return <CloudFog size={size} className="weather-icon" />;
  }
  if (statusLower.includes('wind')) {
    return <Wind size={size} className="weather-icon" />;
  }

  return <Cloud size={size} className="weather-icon" />;
};

export const getWeatherColor = (status: string): string => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('clouds')) {
    return 'bg-gradient-to-r from-blue-400 to-blue-600';
  }
  if (statusLower.includes('rain')) {
    return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  }
  if (statusLower.includes('snow')) {
    return 'bg-gradient-to-r from-slate-300 to-cyan-400';
  }
  if (statusLower.includes('clear') || statusLower.includes('sun')) {
    return 'bg-gradient-to-r from-amber-500 to-orange-600';
  }
  if (statusLower.includes('mist') || statusLower.includes('fog')) {
    return 'bg-gradient-to-r from-rose-400 to-rose-600';
  }

  return 'bg-gradient-to-r from-slate-500 to-slate-600';
};
