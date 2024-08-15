import React from 'react';
import { ImageBackground } from 'react-native';

// Mapeamento dos ícones para os backgrounds
const iconBackgrounds = {
  't01d': require('../assets/backgrounds/t01d.png'),
  't01n': require('../assets/backgrounds/t01n.png'),
  't02d': require('../assets/backgrounds/t02d.png'),
  't02n': require('../assets/backgrounds/t02n.png'),
  't03d': require('../assets/backgrounds/t03d.png'),
  't03n': require('../assets/backgrounds/t03n.png'),
  't04d': require('../assets/backgrounds/t04d.png'),
  't04n': require('../assets/backgrounds/t04n.png'),
  't05d': require('../assets/backgrounds/t05d.png'),
  't05n': require('../assets/backgrounds/t05n.png'),
  'd01d': require('../assets/backgrounds/d01d.png'),
  'd01n': require('../assets/backgrounds/d01n.png'),
  'd02d': require('../assets/backgrounds/d02d.png'),
  'd02n': require('../assets/backgrounds/d02n.png'),
  'd03d': require('../assets/backgrounds/d03d.png'),
  'd03n': require('../assets/backgrounds/d03n.png'),
  'r01d': require('../assets/backgrounds/r01d.png'),
  'r01n': require('../assets/backgrounds/r01n.png'),
  'r02d': require('../assets/backgrounds/r02d.png'),
  'r02n': require('../assets/backgrounds/r02n.png'),
  'r03d': require('../assets/backgrounds/r03d.png'),
  'r03n': require('../assets/backgrounds/r03n.png'),
  'r04d': require('../assets/backgrounds/r04d.png'),
  'r04n': require('../assets/backgrounds/r04n.png'),
  'r05d': require('../assets/backgrounds/r05d.png'),
  'r05n': require('../assets/backgrounds/r05n.png'),
  'r06d': require('../assets/backgrounds/r06d.png'),
  'r06n': require('../assets/backgrounds/r06n.png'),
  's01d': require('../assets/backgrounds/s01d.png'),
  's01n': require('../assets/backgrounds/s01n.png'),
  's02d': require('../assets/backgrounds/s02d.png'),
  's02n': require('../assets/backgrounds/s02n.png'),
  's03d': require('../assets/backgrounds/s03d.png'),
  's03n': require('../assets/backgrounds/s03n.png'),
  's04d': require('../assets/backgrounds/s04d.png'),
  's04n': require('../assets/backgrounds/s04n.png'),
  's05d': require('../assets/backgrounds/s05d.png'),
  's05n': require('../assets/backgrounds/s05n.png'),
  's06d': require('../assets/backgrounds/s06d.png'),
  's06n': require('../assets/backgrounds/s06n.png'),
  'a01d': require('../assets/backgrounds/a01d.png'),
  'a01n': require('../assets/backgrounds/a01n.png'),
  'a02d': require('../assets/backgrounds/a02d.png'),
  'a02n': require('../assets/backgrounds/a02n.png'),
  'a03d': require('../assets/backgrounds/a03d.png'),
  'a03n': require('../assets/backgrounds/a03n.png'),
  'a04d': require('../assets/backgrounds/a04d.png'),
  'a04n': require('../assets/backgrounds/a04n.png'),
  'a05d': require('../assets/backgrounds/a05d.png'),
  'a05n': require('../assets/backgrounds/a05n.png'),
  'a06d': require('../assets/backgrounds/a06d.png'),
  'a06n': require('../assets/backgrounds/a06n.png'),
  'c01d': require('../assets/backgrounds/c01d.png'),
  'c01n': require('../assets/backgrounds/c01n.png'),
  'c02d': require('../assets/backgrounds/c02d.png'),
  'c02n': require('../assets/backgrounds/c02n.png'),
  'c03d': require('../assets/backgrounds/c03d.png'),
  'c03n': require('../assets/backgrounds/c03n.png'),
  'c04d': require('../assets/backgrounds/c04d.png'),
  'c04n': require('../assets/backgrounds/c04n.png'),
  'default': require('../assets/backgrounds/u00d.png'),
};

const BackgroundMapper = ({ iconCode, children }) => {
  const backgroundImage = iconBackgrounds[iconCode] || iconBackgrounds['default'];

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      {children}
    </ImageBackground>
  );
};

export default BackgroundMapper;