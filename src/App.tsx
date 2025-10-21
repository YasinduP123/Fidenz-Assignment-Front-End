import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WeatherDetail } from './pages/WeatherDetail';
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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              weatherData={weatherData}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="/weather/:cityId" element={<WeatherDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
