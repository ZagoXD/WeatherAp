import axios from 'axios';

const API_KEY = '3856b072ab924f34a0c3a0f0024ba306';
const BASE_URL = 'https://api.weatherbit.io/v2.0';
const OPENCAGE_API_KEY = '1360fdec45bc43a89bc5c9a01ca8e862';

export const getCityName = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        key: OPENCAGE_API_KEY,
        q: `${latitude}+${longitude}`,
        pretty: 1,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const city = result.components.city || result.components.town || result.components.village || 'Unknown Location';
      return city;
    }

    return 'Unknown Location';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Unknown Location';
  }
};

export const getHourlyForecast = async (location, date) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast/hourly`, {
      params: {
        key: API_KEY,
        city: location,
        start_date: date,
        end_date: date,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
};

export const getCurrentWeather = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, {
      params: {
        key: API_KEY,
        city: location,
      },
    });

    const weatherData = response.data.data[0];
    return {
      temp: weatherData.temp,
      weather: weatherData.weather,
      precip: weatherData.precip,
      rh: weatherData.rh,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getWeeklyForecast = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast/daily`, {
      params: {
        key: API_KEY,
        city: location,
        days: 7,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching weekly forecast:', error);
    throw error;
  }
};