import { Cloud, CloudRain, CloudSnow, CloudDrizzle, Sun, CloudFog, Wind } from 'lucide-react';

export const getWeatherIcon = (status: string, size: number = 48) => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('rain') || statusLower.includes('drizzle')) {
    return <CloudRain size={size} className="weather-icon" />;
  }
  if (statusLower.includes('cloud')) {
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

  if (statusLower.includes('clear') || statusLower.includes('sun')) {
    return 'from-orange-400 to-orange-600';
  }
  if (statusLower.includes('rain')) {
    return 'from-teal-400 to-teal-600';
  }
  if (statusLower.includes('cloud')) {
    return 'from-blue-400 to-blue-600';
  }
  if (statusLower.includes('snow')) {
    return 'from-cyan-300 to-cyan-500';
  }
  if (statusLower.includes('mist') || statusLower.includes('fog')) {
    return 'from-red-400 to-red-600';
  }

  return 'from-slate-400 to-slate-600';
};
