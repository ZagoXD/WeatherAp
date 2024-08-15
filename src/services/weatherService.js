import axios from 'axios';
import moment from 'moment-timezone';
import * as Location from 'expo-location';
import { WEATHERBIT_API_KEY, OPEN_API_KEY } from '../../config.js'

const API_KEY = WEATHERBIT_API_KEY;
const BASE_URL = 'https://api.weatherbit.io/v2.0';
const OPENCAGE_API_KEY = OPEN_API_KEY;

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

    let forecast = response.data.data;

    const timeZone = moment.tz.guess(true);
    const today = moment().tz(timeZone).startOf('day');

    // Filtra os dias para começar no próximo dia em relação ao dia atual
    forecast = forecast.filter(day => {
      const dayDate = moment(day.valid_date).tz(timeZone).startOf('day');
      return dayDate.isAfter(today);
    });

    // Garante que apenas os próximos 6 dias sejam exibidos
    forecast = forecast.slice(0, 6);

    return forecast;
  } catch (error) {
    console.error('Error fetching weekly forecast:', error);
    throw error;
  }
};

// Função para obter a localização e nome da cidade
export const getLocationAndCityName = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permissão para acessar localização foi negada');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const { latitude, longitude } = location.coords;

    const cityName = await getCityName(latitude, longitude);
    return { location, cityName };
  } catch (error) {
    console.error('Error fetching location and city name:', error);
    throw error;
  }
};

// Função para determinar se é dia ou noite
export const isDaytime = (currentWeather) => {
  const timeZone = moment.tz.guess(true);
  const currentTime = moment().tz(timeZone);
  const sunriseTime = moment(currentWeather.sunrise, 'HH:mm').tz(timeZone);
  const sunsetTime = moment(currentWeather.sunset, 'HH:mm').tz(timeZone);

  return currentTime.isBetween(sunriseTime, sunsetTime);
};

// Função para processar previsões horárias
export const filterHourlyForecastToday = (hourlyToday) => {
  const timeZone = moment.tz.guess(true);
  const today = moment().tz(timeZone).startOf('day');
  const endOfDay = moment().tz(timeZone).endOf('day');

  return hourlyToday.filter(hour => {
    const hourDate = moment(hour.timestamp_local).tz(timeZone);
    return hourDate.isSameOrAfter(today) && hourDate.isSameOrBefore(endOfDay);
  });
};