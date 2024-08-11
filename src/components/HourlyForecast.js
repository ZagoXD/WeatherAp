import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import WeatherIcon from './WeatherIcon';

const HourlyForecast = ({ forecast }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {forecast.map((hour, index) => (
        <View key={index} style={{ alignItems: 'center', margin: 10 }}>
          <Text>{hour.timestamp_local.split('T')[1].slice(0, 5)}</Text>
          <WeatherIcon condition={hour.weather.description} />
          <Text>{hour.temp}°</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default HourlyForecast;