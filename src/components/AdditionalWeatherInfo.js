import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const AdditionalWeatherInfo = ({ windSpeed, windDirection, aqi, uvIndex, sunrise, sunset, humidity, precipitation }) => {
  const windDirectionTranslations = {
    "N": "Norte",
    "NNE": "Norte-Nordeste",
    "NE": "Nordeste",
    "ENE": "Leste-Nordeste",
    "E": "Leste",
    "ESE": "Leste-Sudeste",
    "SE": "Sudeste",
    "SSE": "Sul-Sudeste",
    "S": "Sul",
    "SSW": "Sul-Sudoeste",
    "SW": "Sudoeste",
    "WSW": "Oeste-Sudoeste",
    "W": "Oeste",
    "WNW": "Oeste-Noroeste",
    "NW": "Noroeste",
    "NNW": "Norte-Noroeste",
    "north": "Norte",
    "north-northeast": "Norte-Nordeste",
    "northeast": "Nordeste",
    "east-northeast": "Leste-Nordeste",
    "east": "Leste",
    "east-southeast": "Leste-Sudeste",
    "southeast": "Sudeste",
    "south-southeast": "Sul-Sudeste",
    "south": "Sul",
    "south-southwest": "Sul-Sudoeste",
    "southwest": "Sudoeste",
    "west-southwest": "Oeste-Sudoeste",
    "west": "Oeste",
    "west-northwest": "Oeste-Noroeste",
    "northwest": "Noroeste",
    "north-northwest": "Norte-Noroeste",
  };

  const translatedWindDirection = windDirectionTranslations[windDirection] || windDirection;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações Adicionais</Text>
      <Text style={styles.infoText}>Velocidade do Vento: {windSpeed} m/s</Text>
      <Text style={styles.infoText}>Direção do Vento: {translatedWindDirection}</Text>
      <Text style={styles.infoText}>Qualidade do Ar (AQI): {aqi}</Text>
      <Text style={styles.infoText}>Índice UV: {uvIndex}</Text>
      <Text style={styles.infoText}>Nascer do Sol: {sunrise}</Text>
      <Text style={styles.infoText}>Pôr do Sol: {sunset}</Text>
      <Text style={styles.infoText}>Umidade: {humidity}%</Text>
      <Text style={styles.infoText}>Probabilidade de Chuva: {precipitation} mm/h</Text>
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