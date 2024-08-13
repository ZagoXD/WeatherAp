import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const AdditionalWeatherInfo = ({ windSpeed, windDirection, aqi, uvIndex, sunrise, sunset }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações Adicionais</Text>
      <Text style={styles.infoText}>Velocidade do Vento: {windSpeed} m/s</Text>
      <Text style={styles.infoText}>Direção do Vento: {windDirection}</Text>
      <Text style={styles.infoText}>Qualidade do Ar (AQI): {aqi}</Text>
      <Text style={styles.infoText}>Índice UV: {uvIndex}</Text>
      <Text style={styles.infoText}>Nascer do Sol: {sunrise}</Text>
      <Text style={styles.infoText}>Pôr do Sol: {sunset}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.xlarge,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    borderColor: theme.colors.borderColor,
    borderWidth: 1,
  },
  title: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  infoText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    marginVertical: theme.spacing.small,
  },
});

export default AdditionalWeatherInfo;