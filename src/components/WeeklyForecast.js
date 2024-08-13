import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import WeatherIcon from './WeatherIcon';
import { theme } from '../styles/theme';

const WeeklyForecast = ({ forecast }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {forecast.map((day, index) => (
        <View key={index} style={styles.forecastItem}>
          <Text style={styles.dayText}>
            {new Date(day.valid_date).toLocaleDateString('pt-BR', { weekday: 'long' })}
          </Text>
          <WeatherIcon iconCode={day.weather.icon} size={50} />
          <Text style={styles.tempText}>{day.min_temp}° / {day.max_temp}°</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.medium,
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
    marginBottom: theme.spacing.small,
  },
  dayText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
  },
  tempText: {
    fontSize: theme.fonts.sizes.large,
    color: theme.colors.text,
  },
});

export default WeeklyForecast;