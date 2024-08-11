import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getCityName, getCurrentWeather, getHourlyForecast, getWeeklyForecast } from '../services/weatherService';
import WeatherIcon from '../components/WeatherIcon';
import WeeklyForecast from '../components/WeeklyForecast';
import HourlyForecast from '../components/HourlyForecast';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecastToday, setHourlyForecastToday] = useState([]); // Para o dia atual
  const [hourlyForecastSelectedDay, setHourlyForecastSelectedDay] = useState([]); // Para o dia selecionado no WeeklyForecast
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityName, setCityName] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    (async () => {
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

      // Reorganizar a previsão semanal para começar pelo dia seguinte
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const reorderedWeeklyForecast = weekly
        .filter(day => new Date(day.valid_date) >= tomorrow)
        .concat(weekly.filter(day => new Date(day.valid_date) < tomorrow));

      // Filtrar as horas já passadas do dia de hoje até 23:59
      const filteredHourlyForecastToday = hourlyToday.filter(hour => {
        const hourDate = new Date(hour.timestamp_local);
        return hourDate >= today && hourDate.getDate() === today.getDate();
      });

      setCurrentWeather(current);
      setHourlyForecastToday(filteredHourlyForecastToday); // Estado para o dia atual
      setWeeklyForecast(reorderedWeeklyForecast);
    })();
  }, []);

  const handleDayPress = async (day) => {
    if (selectedDay && selectedDay.valid_date === day.valid_date) {
      setSelectedDay(null);
      setHourlyForecastSelectedDay([]); // Limpar a previsão horária do dia selecionado
    } else {
      setSelectedDay(day);
      const hourly = await getHourlyForecast(cityName, day.valid_date);
      
      // Filtrar para incluir apenas as horas do dia específico de 00:00 até 23:00
      const startOfDay = new Date(day.valid_date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day.valid_date);
      endOfDay.setHours(23, 59, 59, 999);

      const filteredHourlyForecastSelectedDay = hourly.filter(hour => {
        const hourDate = new Date(hour.timestamp_local);
        return hourDate >= startOfDay && hourDate <= endOfDay;
      });

      setHourlyForecastSelectedDay(filteredHourlyForecastSelectedDay); // Estado para o dia selecionado
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
        <WeatherIcon condition={currentWeather.weather.description} timeOfDay={timeOfDay} size={100} />
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
        hourlyForecast={hourlyForecastSelectedDay} // Estado separado para dias selecionados
      />
    </ScrollView>
  );
};

export default HomeScreen;