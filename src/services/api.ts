import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export interface ApiResponse<T> { success: boolean; message: string; data: T; statusCode: number; }

export interface CityWeatherDto {
  cityCode: string;
  name: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  sunrise: string;
  sunset: string;
  cached: boolean;
  cityName: string;
  staticStatus: string;
  staticTemp: string;
}

export const withAuth = async <T>(
  apiCall: () => Promise<T>,
  getToken: () => Promise<string>
): Promise<T> => {
  const token = await getToken();
  setAuthToken(token);
  return apiCall();
};

export const weatherApi = {
  getAllCitiesWeather: async () => {
    const response = await apiClient.get<ApiResponse<CityWeatherDto[]>>('/weather/cities/all-weather', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  },

  getWeatherByCity: async (cityId: string) => {
    const response = await apiClient.get<ApiResponse<CityWeatherDto>>(`/weather/${cityId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  }
};


export default apiClient;
