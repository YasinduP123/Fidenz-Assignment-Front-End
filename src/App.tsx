import { useEffect, useState } from 'react';
import { CloudSun } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { fetchAllWeatherData, WeatherData } from './services/weatherService';
import citiesData from './data/cities.json';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const cityCodes = citiesData.List.map(city => city.CityCode);
        const data = await fetchAllWeatherData(cityCodes);
        setWeatherData(data);
      } catch (err) {
        setError('Failed to load weather data. Please try again later.');
        console.error('Error loading weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();

    const interval = setInterval(loadWeatherData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSun size={48} className="text-blue-400" />
            <h1 className="text-5xl font-bold text-white">Weather App</h1>
          </div>
          <p className="text-slate-400 text-lg">Real-time weather information from around the world</p>
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

        {!loading && !error && weatherData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {weatherData.map((weather) => (
              <WeatherCard key={weather.id} weather={weather} />
            ))}
          </div>
        )}

        <footer className="text-center mt-16 pb-8">
          <p className="text-slate-500 text-sm">2021 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
