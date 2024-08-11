import React from 'react';
import { Image } from 'react-native';

// Mapeamento entre descrições da API Weatherbit e os ícones disponíveis
const iconMap = {
  'clear sky': require('../assets/icons/clear_sky.png'),
  'few clouds': require('../assets/icons/fc.png'),
  'scattered clouds': require('../assets/icons/sc.png'),
  'broken clouds': require('../assets/icons/bc.png'),
  'overcast clouds': require('../assets/icons/oc.png'),
  'light rain': require('../assets/icons/lr.png'),
  'moderate rain': require('../assets/icons/mr.png'),
  'heavy intensity rain': require('../assets/icons/hr.png'),
  'very heavy rain': require('../assets/icons/vr.png'),
  'extreme rain': require('../assets/icons/er.png'),
  'thunderstorm with light rain': require('../assets/icons/twlr.png'),
  'thunderstorm with rain': require('../assets/icons/twr.png'),
  'thunderstorm with heavy rain': require('../assets/icons/twhr.png'),
  'light snow': require('../assets/icons/snow.png'),
  'snow': require('../assets/icons/snow.png'),
  'heavy snow': require('../assets/icons/hs.png'),
  'sleet': require('../assets/icons/sleet.png'),
  'shower sleet': require('../assets/icons/sl.png'),
  'light shower sleet': require('../assets/icons/lss.png'),
  'mist': require('../assets/icons/mist.png'),
  'smoke': require('../assets/icons/smoke.png'),
  'haze': require('../assets/icons/haze.png'),
  'sand/ dust whirls': require('../assets/icons/sand.png'),
  'fog': require('../assets/icons/fog.png'),
  'sand': require('../assets/icons/sand2.png'),
  'dust': require('../assets/icons/dust.png'),
  'volcanic ash': require('../assets/icons/va.png'),
  'squalls': require('../assets/icons/squall.png'),
  'tornado': require('../assets/icons/tornado.png'),
  // Adicione mais mapeamentos conforme necessário
};

const WeatherIcon = ({ condition, size = 100 }) => {
  // Use o mapeamento para encontrar o ícone correspondente
  const icon = iconMap[condition.toLowerCase()] || iconMap['clear'];

  return <Image source={icon} style={{ width: 50, height: 50 }} />;
};

export default WeatherIcon;