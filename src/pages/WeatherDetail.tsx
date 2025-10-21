import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudSun, Navigation } from 'lucide-react';
import { fetchWeatherData, WeatherData } from '../services/weatherService';
import { getWeatherIcon, getWeatherColor } from '../utils/weatherIcons';

export const WeatherDetail = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherDetail = async () => {
      if (!cityId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherData(cityId);
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather details. Please try again later.');
        console.error('Error loading weather details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherDetail();
  }, [cityId]);

  const formatDescription = (desc: string) => {
    return desc.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
          <p className="text-white text-xl">Loading weather details...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-200 text-lg mb-4">{error || 'Weather data not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const mainStatus = weather.weather[0].main;
  const description = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const tempMin = Math.round(weather.main.temp_min);
  const tempMax = Math.round(weather.main.temp_max);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSun size={48} className="text-blue-400" />
            <h1 className="text-5xl font-bold text-white">Weather App</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-br ${getWeatherColor(mainStatus)} p-12 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
                <div className="absolute inset-0 transform scale-150">
                  {getWeatherIcon(mainStatus, 384)}
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm z-10"
              >
                <ArrowLeft size={24} />
              </button>

              <div className="relative z-10 text-center">
                <h2 className="text-5xl font-bold text-white mb-3">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-white/90 text-lg mb-12">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                <div className="flex items-center justify-center gap-8 mb-12">
                  <div className="text-white">
                    {getWeatherIcon(mainStatus, 96)}
                  </div>
                  <div className="h-32 w-px bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-8xl font-bold text-white mb-4">
                      {temp}°C
                    </div>
                    <p className="text-white text-2xl font-medium mb-2">{formatDescription(description)}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-16 text-white/90 text-lg">
                  <div>
                    <p className="text-white/70 mb-1">Temp Min:</p>
                    <p className="font-semibold text-2xl">{tempMin}°C</p>
                  </div>
                  <div>
                    <p className="text-white/70 mb-1">Temp Max:</p>
                    <p className="font-semibold text-2xl">{tempMax}°C</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm p-12">
              <div className="grid grid-cols-3 gap-12 text-white/90">
                <div>
                  <p className="text-sm text-white/60 mb-2">Pressure:</p>
                  <p className="font-semibold text-xl mb-6">{weather.main.pressure}hPa</p>
                  <p className="text-sm text-white/60 mb-2">Humidity:</p>
                  <p className="font-semibold text-xl mb-6">{weather.main.humidity}%</p>
                  <p className="text-sm text-white/60 mb-2">Visibility:</p>
                  <p className="font-semibold text-xl">{(weather.visibility / 1000).toFixed(1)}km</p>
                </div>

                <div className="flex flex-col items-center justify-center border-x border-slate-600/50">
                  <Navigation
                    size={48}
                    className="text-white/80 mb-4"
                    style={{ transform: `rotate(${weather.wind.deg}deg)` }}
                  />
                  <p className="text-3xl font-bold mb-2">{weather.wind.speed.toFixed(1)}m/s</p>
                  <p className="text-lg text-white/60">{weather.wind.deg} Degree</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-white/60 mb-2">Sunrise:</p>
                  <p className="font-semibold text-xl mb-6">{sunrise}</p>
                  <p className="text-sm text-white/60 mb-2">Sunset:</p>
                  <p className="font-semibold text-xl">{sunset}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 pb-8">
          <p className="text-slate-500 text-sm">2021 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
};
