import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import WeatherIcon from './WeatherIcon';

const WeeklyForecast = ({ forecast }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {forecast.map((day, index) => (
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <Text>{new Date(day.valid_date).toLocaleDateString('pt-BR', { weekday: 'long' })}</Text>
          <WeatherIcon condition={day.weather.description} />
          <Text>{day.min_temp}° / {day.max_temp}°</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default WeeklyForecast;