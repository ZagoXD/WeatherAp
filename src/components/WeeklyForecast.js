import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import WeatherIcon from './WeatherIcon';
import HourlyForecast from './HourlyForecast';

const WeeklyForecast = ({ forecast, onDayPress, selectedDay, hourlyForecast }) => {
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour >= 6 && currentHour < 18 ? 'day' : 'night';

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {forecast.map((day, index) => (
        <View key={index}>
          <TouchableOpacity onPress={() => onDayPress(day)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
              <Text>{new Date(day.valid_date).toLocaleDateString('pt-BR', { weekday: 'long' })}</Text>
              <WeatherIcon condition={day.weather.description} timeOfDay={timeOfDay} size={50} />
              <Text>{day.min_temp}° / {day.max_temp}°</Text>
            </View>
          </TouchableOpacity>

          {selectedDay && selectedDay.valid_date === day.valid_date && (
            <View style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}>
              <HourlyForecast forecast={hourlyForecast} />
              <Text>Umidade: {selectedDay.rh}%</Text>
              <Text>Probabilidade de Chuva: {selectedDay.precip} mm</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default WeeklyForecast;