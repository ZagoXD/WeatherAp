import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import WeatherIcon from './WeatherIcon';
import { theme } from '../styles/theme';

const WeeklyForecast = ({ forecast }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {forecast.map((day, index) => (
        <View key={index} style={styles.forecastItem}>
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>
              {new Date(day.valid_date).toLocaleDateString('pt-BR', { weekday: 'long' })}
            </Text>
            <Text style={styles.dateText}>
              {new Date(day.valid_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}
            </Text>
          </View>
          <WeatherIcon iconCode={day.weather.icon} size={50} style={styles.iconW} />
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
  dayContainer: {
    flex: 0.4,
  },
  dayText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
  },
  dateText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  tempText: {
    flex: 0.5,
    fontSize: theme.fonts.sizes.large,
    color: theme.colors.text,
    textAlign: 'right'
  },
  iconW: {
    flex: 0.1
  },
});

export default WeeklyForecast;