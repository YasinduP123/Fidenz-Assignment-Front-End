const OPENWEATHER_API_KEY = '0c5b1a804614d571edfc19ebdf4ed5b5';
const CACHE_DURATION = 5 * 60 * 1000;

interface WeatherCache {
  data: WeatherData;
  timestamp: number;
}

export interface WeatherData {
  id: number;
  name: string;
  sys: {
    country: string;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  sys_sunrise?: number;
  sys_sunset?: number;
}

const weatherCache = new Map<string, WeatherCache>();

export const fetchWeatherData = async (cityCode: string): Promise<WeatherData> => {
  const cachedData = weatherCache.get(cityCode);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data for city ${cityCode}`);
  }

  const data: WeatherData = await response.json();

  weatherCache.set(cityCode, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

export const fetchAllWeatherData = async (cityCodes: string[]): Promise<WeatherData[]> => {
  const promises = cityCodes.map(code => fetchWeatherData(code));
  return Promise.all(promises);
};
