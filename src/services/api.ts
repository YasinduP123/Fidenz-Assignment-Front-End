import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface CityDto {
  id: number;
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  cityCode: string;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface UserDto {
  id: number;
  auth0Id: string;
  email: string;
  name: string;
  picture: string;
  createdAt: string;
  lastLoginAt: string;
  active: boolean;
  preferredCity?: string;
  temperatureUnit?: string;
}

export const weatherApi = {
  getAllCities: async () => {
    const response = await apiClient.get<ApiResponse<CityDto[]>>('/weather/cities');
    return response.data;
  },

  searchCities: async (name: string) => {
    const response = await apiClient.get<ApiResponse<CityDto[]>>(`/weather/cities/search`, {
      params: { name }
    });
    return response.data;
  },

  getWeatherByCity: async (cityCode: string) => {
    const response = await apiClient.get<ApiResponse<WeatherData>>(`/weather/${cityCode}`);
    return response.data;
  },

  getAllCitiesWeather: async () => {
    const response = await apiClient.get<ApiResponse<WeatherData[]>>('/weather/cities/all-weather');
    return response.data;
  },

  clearCityCache: async (cityCode: string) => {
    const response = await apiClient.delete<ApiResponse<string>>(`/weather/cache/${cityCode}`);
    return response.data;
  },

  clearAllCache: async () => {
    const response = await apiClient.delete<ApiResponse<string>>('/weather/cache/all');
    return response.data;
  }
};

export const userApi = {
  syncUser: async () => {
    const response = await apiClient.post<ApiResponse<UserDto>>('/user/sync');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<UserDto>>('/user/profile');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<Record<string, any>>>('/user/me');
    return response.data;
  },

  updatePreferences: async (preferredCity: string, temperatureUnit: string) => {
    const response = await apiClient.put<ApiResponse<UserDto>>('/user/preferences', {
      preferredCity,
      temperatureUnit
    });
    return response.data;
  }
};

export default apiClient;
