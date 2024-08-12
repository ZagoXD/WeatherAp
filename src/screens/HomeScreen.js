import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getCityName, getCurrentWeather, getHourlyForecast, getWeeklyForecast } from '../services/weatherService';
import WeatherIcon from '../components/WeatherIcon';
import WeeklyForecast from '../components/WeeklyForecast';
import HourlyForecast from '../components/HourlyForecast';
import moment from 'moment-timezone';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecastToday, setHourlyForecastToday] = useState([]); 
  const [hourlyForecastSelectedDay, setHourlyForecastSelectedDay] = useState([]); 
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityName, setCityName] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão para acessar localização foi negada');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(location);

        const fetchedCityName = await getCityName(location.coords.latitude, location.coords.longitude);
        setCityName(fetchedCityName);

        const current = await getCurrentWeather(fetchedCityName);
        const hourlyToday = await getHourlyForecast(fetchedCityName);
        const weekly = await getWeeklyForecast(fetchedCityName);

        const timeZone = moment.tz.guess(true);
        const today = moment().tz(timeZone).startOf('day');
        const todayIndex = weekly.findIndex(day => moment(day.valid_date).isSame(today, 'day'));

        const reorderedWeeklyForecast = weekly
          .slice(todayIndex + 1)
          .concat(weekly.slice(0, todayIndex + 1));

        const filteredHourlyForecastToday = hourlyToday.filter(hour => {
          const hourDate = moment(hour.timestamp_local).tz(timeZone);
          return hourDate.isSameOrAfter(today) && hourDate.isSame(today, 'day');
        });

        setCurrentWeather(current);
        setHourlyForecastToday(filteredHourlyForecastToday); 
        setWeeklyForecast(reorderedWeeklyForecast);
      } catch (error) {
        setErrorMsg('Erro ao buscar dados de previsão do tempo.');
        console.error(error);
      }
    };

    fetchWeatherData();
  }, []);

  const handleDayPress = async (day) => {
    if (selectedDay && selectedDay.valid_date === day.valid_date) {
      setSelectedDay(null);
      setHourlyForecastSelectedDay([]);
    } else {
      setSelectedDay(day);
      const timeZone = moment.tz.guess(true);
      const hourly = await getHourlyForecast(cityName, day.valid_date);

      const startOfDay = moment(day.valid_date).startOf('day').tz(timeZone);
      const endOfDay = moment(day.valid_date).endOf('day').tz(timeZone);

      const filteredHourlyForecastSelectedDay = hourly.filter(hour => {
        const hourDate = moment(hour.timestamp_local);
        return hourDate.isSameOrAfter(startOfDay) && hourDate.isSameOrBefore(endOfDay);
      });

      setHourlyForecastSelectedDay(filteredHourlyForecastSelectedDay);
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!currentWeather) {
    return <Text>Aguardando dados meteorológicos...</Text>;
  }

  const currentHour = new Date().getHours();
  const timeOfDay = currentHour >= 6 && currentHour < 18 ? 'day' : 'night';

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: 'center' }}>
      <WeatherIcon iconCode={currentWeather.weather.icon} size={100} />
        <Text style={{ fontSize: 48 }}>{currentWeather.temp}°</Text>
        <Text>{cityName}</Text>
        <Text>Umidade: {currentWeather.rh}%</Text>
        <Text>Probabilidade de Chuva: {currentWeather.precip} mm</Text>
      </View>

      <HourlyForecast forecast={hourlyForecastToday} />

      <WeeklyForecast 
        forecast={weeklyForecast} 
        onDayPress={handleDayPress} 
        selectedDay={selectedDay} 
        hourlyForecast={hourlyForecastSelectedDay}
      />
    </ScrollView>
  );
};

export default HomeScreen;