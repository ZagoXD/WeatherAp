import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { getCurrentWeather, getHourlyForecast, getWeeklyForecast, getLocationAndCityName, isDaytime, filterHourlyForecastToday } from '../services/weatherService';
import WeatherIcon from '../components/WeatherIcon';
import WeeklyForecast from '../components/WeeklyForecast';
import HourlyForecast from '../components/HourlyForecast';
import AdditionalWeatherInfo from '../components/AdditionalWeatherInfo';
import TemperatureGraph from '../components/TemperatureGraph';
import { theme } from '../styles/theme';
import axios from 'axios';
import LoadingScreen from '../components/loadingScreen';
import BackgroundMapper from '../components/BackgroundMapper';
import moment from 'moment';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecastToday, setHourlyForecastToday] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityName, setCityName] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [textColor, setTextColor] = useState(theme.colors.text);
  const [modalVisible, setModalVisible] = useState(false);

  const currentDate = moment().format('DD / MM / YYYY');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const { location, cityName } = await getLocationAndCityName();
        setLocation(location);
        setCityName(cityName);

        const { latitude, longitude } = location.coords;
        const current = await getCurrentWeather(latitude, longitude);
        const hourlyToday = await getHourlyForecast(latitude, longitude);
        const weekly = await getWeeklyForecast(latitude, longitude);

        setCurrentWeather(current);
        setHourlyForecastToday(filterHourlyForecastToday(hourlyToday));
        setWeeklyForecast(weekly);

        setTextColor(isDaytime(current) ? theme.colors.text : '#FFFFFF');
      } catch (error) {
        setErrorMsg('Erro ao buscar dados de previsão do tempo.');
        console.error(error);
      }
    };

    fetchWeatherData();
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length > 2) {
      try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
          params: {
            key: '1360fdec45bc43a89bc5c9a01ca8e862',
            q: text,
            limit: 5,
          },
        });

        const results = response.data.results.map(result => {
          const city = result.components.city || result.components.town || result.components.village || result.components.municipality || result.components._normalized_city || result.components.county;
          const country = result.components.country;

          if (!city || !country) {
            console.error('City or country is missing:', result);
            return null;
          }

          return {
            name: city,
            country: country,
            formattedName: `${city}, ${country}`,
            latitude: result.geometry.lat,
            longitude: result.geometry.lng,
          };
        }).filter(item => item !== null);

        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCitySelect = async (city) => {
    try {
      setModalVisible(true); // Mostrar o modal de carregamento

      const cityQuery = `${city.name}, ${city.country}`;
      setQuery(cityQuery);
      setCityName(cityQuery);
      setSuggestions([]);

      const latitude = city.latitude;
      const longitude = city.longitude;

      const current = await getCurrentWeather(latitude, longitude);
      const hourlyToday = await getHourlyForecast(latitude, longitude);
      const weekly = await getWeeklyForecast(latitude, longitude);

      setCurrentWeather(current);
      setHourlyForecastToday(filterHourlyForecastToday(hourlyToday));
      setWeeklyForecast(weekly);

      setTextColor(isDaytime(current) ? theme.colors.text : '#FFFFFF');
      setModalVisible(false); // Ocultar o modal após o carregamento
    } catch (error) {
      console.error('Error fetching weather data for selected city:', error);
      setModalVisible(false); // Ocultar o modal em caso de erro
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!currentWeather) {
    return <LoadingScreen />;
  }

  return (
    <BackgroundMapper iconCode={currentWeather.weather.icon}>
      <FlatList
        style={styles.container}
        ListHeaderComponent={
          <>
            {/* Modal para mostrar o indicador de carregamento */}
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Carregando...</Text>
              </View>
            </Modal>

            <TextInput
              style={[styles.searchInput, { color: textColor, borderColor: textColor }]} 
              placeholder="Digite o nome da cidade..."
              placeholderTextColor={textColor}
              value={query}
              onChangeText={handleSearch}
            />
            
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleCitySelect(item)}>
                    <Text style={[styles.suggestionText]}>{item.formattedName}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            )}

            <View style={styles.header}>
              <WeatherIcon iconCode={currentWeather.weather.icon} size={100} />
              <Text style={[styles.temperature, { color: textColor }]}>{currentWeather.temp}°</Text>
              <Text style={[styles.cityName, { color: textColor }]}>{cityName ? cityName : "Carregando..."}</Text>
              <Text style={[styles.dateText, { color: textColor }]}>{currentDate}</Text>
            </View>
          </>
        }
        data={[{ key: 'Hourly' }, { key: 'Weekly' }, { key: 'TemperatureGraph' }, { key: 'AdditionalInfo' }]}
        renderItem={({ item }) => {
          if (item.key === 'Hourly') {
              return <HourlyForecast forecast={hourlyForecastToday} textColor={textColor} />;
          } else if (item.key === 'Weekly') {
              return <WeeklyForecast forecast={weeklyForecast} />;
          } else if (item.key === 'TemperatureGraph') {
              return <TemperatureGraph weeklyForecast={weeklyForecast} />;
          } else if (item.key === 'AdditionalInfo') {
              return (
                  <AdditionalWeatherInfo
                      windSpeed={currentWeather.wind_spd}
                      windDirection={currentWeather.wind_cdir_full}
                      aqi={currentWeather.aqi}
                      uvIndex={currentWeather.uv}
                      sunrise={currentWeather.sunrise}
                      sunset={currentWeather.sunset}
                      humidity={currentWeather.rh}
                      precipitation={currentWeather.precip}
                  />
              );
          }
      }}
      />
    </BackgroundMapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: 'transparent',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: theme.borderRadius.small,
    paddingLeft: 8,
    marginBottom: theme.spacing.medium,
  },
  suggestionsList: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.medium,
  },
  suggestionText: {
    padding: theme.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  temperature: {
    fontSize: theme.fonts.sizes.xlarge,
    fontFamily: theme.fonts.main,
  },
  cityName: {
    fontSize: theme.fonts.sizes.large,
    fontFamily: theme.fonts.main,
  },
  dateText: {
    fontSize: theme.fonts.sizes.medium,
    fontFamily: theme.fonts.secondary,
    marginTop: theme.spacing.small,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: theme.fonts.sizes.medium,
    color: '#FFFFFF',
    fontFamily: theme.fonts.main,
  },
});

export default HomeScreen;