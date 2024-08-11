import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getCityName, getCurrentWeather, getHourlyForecast, getWeeklyForecast } from '../services/weatherService';
import WeatherIcon from '../components/WeatherIcon';
import HourlyForecast from '../components/HourlyForecast';
import WeeklyForecast from '../components/WeeklyForecast';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityName, setCityName] = useState('');

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

      console.log('Latitude:', location.coords.latitude);
      console.log('Longitude:', location.coords.longitude);

      setLocation(location);

      const fetchedCityName = await getCityName(location.coords.latitude, location.coords.longitude);
      console.log('Cidade detectada:', fetchedCityName);
      setCityName(fetchedCityName);

      const current = await getCurrentWeather(fetchedCityName);
      const hourly = await getHourlyForecast(fetchedCityName);
      const weekly = await getWeeklyForecast(fetchedCityName);

      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setWeeklyForecast(weekly);
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!currentWeather) {
    return <Text>Aguardando dados meteorológicos...</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: 'center' }}>
        <WeatherIcon condition={currentWeather.weather.description} />
        <Text style={{ fontSize: 48 }}>{currentWeather.temp}°</Text>
        <Text>{cityName}</Text> 
      </View>

      <HourlyForecast forecast={hourlyForecast} />
      <WeeklyForecast forecast={weeklyForecast} />
    </ScrollView>
  );
};

export default HomeScreen;