import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const DetailScreen = ({ route }) => {
  const { weatherData } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Detalhes Climáticos</Text>
      <LineChart
        data={{
          labels: ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h'],
          datasets: [
            {
              data: weatherData.hourly.map(hour => hour.temp)
            }
          ]
        }}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
        }}
      />
    </View>
  );
};

export default DetailScreen;