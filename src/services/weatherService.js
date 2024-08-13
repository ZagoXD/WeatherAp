import axios from 'axios';
import moment from 'moment-timezone';

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

export const getCurrentWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, {
      params: {
        key: API_KEY,
        lat: latitude,
        lon: longitude,
      },
    });

    const weatherData = response.data.data[0];
    const timeZone = moment.tz.guess(true);

    // Convertendo os horários do UTC para o fuso horário local do usuário
    const sunriseLocal = moment.tz(weatherData.sunrise, 'HH:mm', 'UTC').tz(timeZone).format('HH:mm');
    const sunsetLocal = moment.tz(weatherData.sunset, 'HH:mm', 'UTC').tz(timeZone).format('HH:mm');

    return {
      temp: weatherData.temp,
      weather: weatherData.weather,
      precip: weatherData.precip,
      rh: weatherData.rh,
      wind_spd: weatherData.wind_spd,
      wind_cdir_full: weatherData.wind_cdir_full,
      aqi: weatherData.aqi,
      uv: weatherData.uv,
      sunrise: sunriseLocal,
      sunset: sunsetLocal,
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getHourlyForecast = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast/hourly`, {
      params: {
        key: API_KEY,
        lat: latitude,
        lon: longitude,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
};

export const getWeeklyForecast = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast/daily`, {
      params: {
        key: API_KEY,
        lat: latitude,
        lon: longitude,
        days: 7,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching weekly forecast:', error);
    throw error;
  }
};