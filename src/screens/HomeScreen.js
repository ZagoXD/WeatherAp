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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPEN_API_KEY } from '../../config.js'

const HomeScreen = ({ route, navigation }) => {
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
  const [recentSearches, setRecentSearches] = useState([]);

  const currentDate = moment().format('DD / MM / YYYY');

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem('recentSearches');
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };

    loadRecentSearches();

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

  useEffect(() => {
    if (route.params && route.params.selectedCity) {
      handleCitySelect(route.params.selectedCity);
      navigation.setParams({ selectedCity: null }); 
    }
  }, [route.params]);

  const saveRecentSearch = async (city) => {
    try {
        let updatedSearches = recentSearches.filter(
            (search) => search.formattedName !== city.formattedName
        );

        updatedSearches = [city, ...updatedSearches];

        // Limite a lista a 10 elementos
        if (updatedSearches.length > 10) {
            updatedSearches = updatedSearches.slice(0, 10);
        }

        setRecentSearches(updatedSearches);
        await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
        console.error('Error saving recent search:', error);
    }
};

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length > 2) {
        try {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: {
                    key: OPEN_API_KEY,
                    q: text,
                    limit: 5,
                },
            });

            const results = response.data.results.map(result => {
                const city = result.components.city || result.components.town || result.components.village || result.components.municipality || result.components._normalized_city || result.components.county;
                const country = result.components.country;
                const type = result.components._type;

                if (!city || !country || (type !== 'city' && type !== 'town' && type !== 'village' && type !== 'municipality')) {
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

            const uniqueResults = Array.from(new Set(results.map(a => a.formattedName)))
                .map(name => {
                    return results.find(a => a.formattedName === name);
                });

            setSuggestions(uniqueResults);
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

      await saveRecentSearch(city);
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
              <Text style={[styles.cityName, { color: textColor }]}>{cityName ? cityName : "Carregando..."} </Text>
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
    marginTop: theme.spacing.xxlarge,
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
