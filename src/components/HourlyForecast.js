import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import WeatherIcon from './WeatherIcon';
import { theme } from '../styles/theme';

const HourlyForecast = ({ forecast }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {forecast.map((hour, index) => {
        const formattedTime = new Date(hour.timestamp_local).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.timeText}>{formattedTime}</Text>
            <WeatherIcon iconCode={hour.weather.icon} size={50} />
            <Text style={styles.tempText}>{hour.temp}°</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.small,
  },
  forecastItem: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.small,
  },
  timeText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.text,
  },
  tempText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
  },
});

export default HourlyForecast;