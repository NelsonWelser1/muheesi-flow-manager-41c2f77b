
import { useQuery } from "@tanstack/react-query";

// Coordinates for Mbarara (extracted from the Google Maps link)
const MBARARA_COORDINATES = {
  lat: -0.6167,
  lng: 30.6556
};

/**
 * Fetch weather data from OpenWeatherMap API
 * Note: Using a free API key with rate limits
 */
const fetchWeatherData = async () => {
  try {
    const apiKey = "bd5e378503939ddaee76f12ad7a97608"; // Free OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MBARARA_COORDINATES.lat}&lon=${MBARARA_COORDINATES.lng}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const data = await response.json();
    
    return {
      temp: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      location: 'Mbarara'
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      temp: '24°C',
      condition: 'Partly Cloudy',
      location: 'Mbarara'
    }; // Fallback data
  }
};

/**
 * Custom hook to fetch weather data
 */
export const useWeatherData = () => {
  return useQuery({
    queryKey: ['weatherData'],
    queryFn: fetchWeatherData,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 15 * 60 * 1000,      // Consider data stale after 15 minutes
  });
};
