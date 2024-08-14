import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import { getCurrentWeather, getHourlyForecast, getWeeklyForecast } from '../services/weatherService';
import WeatherIcon from '../components/WeatherIcon';
import WeeklyForecast from '../components/WeeklyForecast';
import HourlyForecast from '../components/HourlyForecast';
import moment from 'moment-timezone';
import AdditionalWeatherInfo from '../components/AdditionalWeatherInfo';
import { theme } from '../styles/theme';
import axios from 'axios';
import backgroundDay from '../assets/background1.png';
import backgroundNight from '../assets/background2.png';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecastToday, setHourlyForecastToday] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityName, setCityName] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [background, setBackground] = useState(backgroundDay);
  const [textColor, setTextColor] = useState(theme.colors.text); // Inicialize com a cor padrão do tema

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão para acessar localização foi negada');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(location);

        const { latitude, longitude } = location.coords;

        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                key: '1360fdec45bc43a89bc5c9a01ca8e862',
                q: `${latitude}+${longitude}`,
                pretty: 1,
            },
        });

        if (response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          const city = result.components.city || result.components.town || result.components.village || result.components.municipality || result.components._normalized_city || result.components.county;
          const country = result.components.country;

          if (city && country) {
            setCityName(`${city}, ${country}`);
          } else {
            setCityName('Localização desconhecida');
          }
        } else {
          setCityName('Localização desconhecida');
        }

        const current = await getCurrentWeather(latitude, longitude);
        const hourlyToday = await getHourlyForecast(latitude, longitude);
        const weekly = await getWeeklyForecast(latitude, longitude);

        const timeZone = moment.tz.guess(true);
        const today = moment().tz(timeZone).startOf('day');
        const endOfDay = moment().tz(timeZone).endOf('day');

        const filteredHourlyForecastToday = hourlyToday.filter(hour => {
          const hourDate = moment(hour.timestamp_local).tz(timeZone);
          return hourDate.isSameOrAfter(today) && hourDate.isSameOrBefore(endOfDay);
        });

        const reorderedWeeklyForecast = [
          ...weekly.slice(1),
          weekly[0]
        ];

        setCurrentWeather(current);
        setHourlyForecastToday(filteredHourlyForecastToday);
        setWeeklyForecast(reorderedWeeklyForecast);

        // Determinar se é dia ou noite
        const currentTime = moment().tz(timeZone);
        const sunriseTime = moment(current.sunrise, 'HH:mm').tz(timeZone);
        const sunsetTime = moment(current.sunset, 'HH:mm').tz(timeZone);

        if (currentTime.isBetween(sunriseTime, sunsetTime)) {
          setBackground(backgroundDay);
          setTextColor(theme.colors.text); // Cor preta para o dia
        } else {
          setBackground(backgroundNight);
          setTextColor('#FFFFFF'); // Cor branca para a noite
        }

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
      const cityQuery = `${city.name}, ${city.country}`;
      setQuery(cityQuery);
      setCityName(cityQuery);
      setSuggestions([]);

      const latitude = city.latitude;
      const longitude = city.longitude;

      const current = await getCurrentWeather(latitude, longitude);
      const hourlyToday = await getHourlyForecast(latitude, longitude);
      const weekly = await getWeeklyForecast(latitude, longitude);

      const timeZone = moment.tz.guess(true);
      const today = moment().tz(timeZone).startOf('day');
      const endOfDay = moment().tz(timeZone).endOf('day');

      const filteredHourlyForecastToday = hourlyToday.filter(hour => {
        const hourDate = moment(hour.timestamp_local).tz(timeZone);
        return hourDate.isSameOrAfter(today) && hourDate.isSameOrBefore(endOfDay);
      });

      const reorderedWeeklyForecast = [
        ...weekly.slice(1),
        weekly[0]
      ];

      setCurrentWeather(current);
      setHourlyForecastToday(filteredHourlyForecastToday);
      setWeeklyForecast(reorderedWeeklyForecast);

      // Determinar se é dia ou noite
      const currentTime = moment().tz(timeZone);
      const sunriseTime = moment(current.sunrise, 'HH:mm').tz(timeZone);
      const sunsetTime = moment(current.sunset, 'HH:mm').tz(timeZone);

      if (currentTime.isBetween(sunriseTime, sunsetTime)) {
        setBackground(backgroundDay);
        setTextColor(theme.colors.text); // Cor preta para o dia
      } else {
        setBackground(backgroundNight);
        setTextColor('#FFFFFF'); // Cor branca para a noite
      }

    } catch (error) {
      console.error('Error fetching weather data for selected city:', error);
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!currentWeather) {
    return <Text>Aguardando dados meteorológicos...</Text>;
  }

  return (
    <ImageBackground source={background} style={styles.background}>
        <FlatList
        style={styles.container}
        ListHeaderComponent={
          <>
            <TextInput
              style={[styles.searchInput, { color: textColor, borderColor: textColor }]} // Aplicando cor dinâmica
              placeholder="Digite o nome da cidade..."
              placeholderTextColor={textColor} // Cor do placeholder dinâmica
              value={query}
              onChangeText={handleSearch}
            />
            
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleCitySelect(item)}>
                    <Text style={[styles.suggestionText, { color: textColor }]}>{item.formattedName}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            )}

            <View style={styles.header}>
              <WeatherIcon iconCode={currentWeather.weather.icon} size={100} />
              <Text style={[styles.temperature, { color: textColor }]}>{currentWeather.temp}°</Text>
              <Text style={[styles.cityName, { color: textColor }]}>{cityName ? cityName : "Carregando..."}</Text>
              <Text style={[styles.infoText, { color: textColor }]}>Umidade: {currentWeather.rh}%</Text>
              <Text style={[styles.infoText, { color: textColor }]}>Probabilidade de Chuva: {currentWeather.precip} mm</Text>
            </View>
          </>
        }
        data={[{key: 'Hourly'}, {key: 'Weekly'}, {key: 'AdditionalInfo'}]}
        renderItem={({item}) => {
          if(item.key === 'Hourly') {
            return <HourlyForecast forecast={hourlyForecastToday} textColor={textColor} />
          } else if(item.key === 'Weekly') {
            return <WeeklyForecast forecast={weeklyForecast} />
          } else if(item.key === 'AdditionalInfo') {
            return (
              <AdditionalWeatherInfo
                windSpeed={currentWeather.wind_spd}
                windDirection={currentWeather.wind_cdir_full}
                aqi={currentWeather.aqi}
                uvIndex={currentWeather.uv}
                sunrise={currentWeather.sunrise}
                sunset={currentWeather.sunset}
              />
            )
          }
        }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
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
  infoText: {
    fontSize: theme.fonts.sizes.medium,
    fontFamily: theme.fonts.secondary,
    marginTop: theme.spacing.small,
  },
});

export default HomeScreen;