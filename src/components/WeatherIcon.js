import React from 'react';
import { Image } from 'react-native';

// Mapeamento entre descrições da API Weatherbit e os ícones disponíveis
const iconMap = {
  'clear sky day': require('../assets/icons/clear_sky_day.png'),
  'clear sky night': require('../assets/icons/clear_sky_night.png'),
  'few clouds day': require('../assets/icons/fc_day.png'),
  'few clouds night': require('../assets/icons/fc_night.png'),
  'scattered clouds day': require('../assets/icons/sc_day.png'),
  'scattered clouds night': require('../assets/icons/sc_night.png'),
  'broken clouds day': require('../assets/icons/bc_day.png'),
  'broken clouds night': require('../assets/icons/bc_night.png'),
  'overcast clouds day': require('../assets/icons/oc_day.png'),
  'overcast clouds night': require('../assets/icons/oc_night.png'),
  'light rain day': require('../assets/icons/lr_day.png'),
  'light rain night': require('../assets/icons/lr_night.png'),
  'moderate rain day': require('../assets/icons/mr_day.png'),
  'moderate rain night': require('../assets/icons/mr_night.png'),
  'heavy intensity rain day': require('../assets/icons/hr_day.png'),
  'heavy intensity rain night': require('../assets/icons/hr_night.png'),
  'mist day': require('../assets/icons/mist_day.png'),
  'mist night': require('../assets/icons/mist_night.png'),
  'smoke day': require('../assets/icons/smoke_day.png'),
  'smoke night': require('../assets/icons/smoke_night.png'),
  'haze day': require('../assets/icons/haze_day.png'),
  'haze night': require('../assets/icons/haze_night.png'),
  'fog day': require('../assets/icons/fog_day.png'),
  'fog night': require('../assets/icons/fog_night.png'),
  'sand day': require('../assets/icons/sand_day.png'),
  'sand night': require('../assets/icons/sand_night.png'),
  'volcanic ash day': require('../assets/icons/va_day.png'),
  'volcanic ash night': require('../assets/icons/va_night.png'),
  'squalls day': require('../assets/icons/squall_day.png'),
  'squalls night': require('../assets/icons/squall_night.png'),
  'tornado day': require('../assets/icons/tornado_day.png'),
  'tornado night': require('../assets/icons/tornado_night.png'),
};

const WeatherIcon = ({ condition, timeOfDay, size = 100 }) => {
  const iconKey = `${condition.toLowerCase()} ${timeOfDay}`;
  const icon = iconMap[iconKey] || iconMap['clear sky day']; // Fallback para 'clear sky day'

  return <Image source={icon} style={{ width: size, height: size }} />;
};

export default WeatherIcon;