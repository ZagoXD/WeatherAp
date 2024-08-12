import React from 'react';
import { Image } from 'react-native';

const WeatherIcon = ({ iconCode, size = 100 }) => {
  // Construindo a URL do ícone
  const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

  return <Image source={{ uri: iconUrl }} style={{ width: size, height: size }} />;
};

export default WeatherIcon;