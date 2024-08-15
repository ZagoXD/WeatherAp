import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet, Text, ScrollView } from 'react-native';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const TemperatureGraph = ({ weeklyForecast }) => {
  if (!weeklyForecast || weeklyForecast.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Dados de temperatura indisponíveis</Text>
      </View>
    );
  }

  const temperaturesMin = weeklyForecast.map(day => day.min_temp);
  const temperaturesMax = weeklyForecast.map(day => day.max_temp);
  const labels = weeklyForecast.map(day => moment(day.valid_date).format('DD/MM'));

  if (temperaturesMin.includes(undefined) || temperaturesMax.includes(undefined) || labels.includes(undefined)) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os dados do gráfico</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal={true} style={styles.scrollContainer} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: temperaturesMin,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Cor azul para temperaturas mínimas
                strokeWidth: 2,
              },
              {
                data: temperaturesMax,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Cor vermelha para temperaturas máximas
                strokeWidth: 2,
              },
            ],
            legend: ['Mínima', 'Máxima'],
          }}
          width={screenWidth * 1.5} // Largura para permitir rolagem horizontal
          height={220}
          yAxisLabel=""
          yAxisSuffix="°C"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: 8,
  },
  container: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
  },
});

export default TemperatureGraph;