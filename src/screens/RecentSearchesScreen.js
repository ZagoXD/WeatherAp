import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecentSearchesScreen = ({ navigation }) => {
  const [recentSearches, setRecentSearches] = useState([]);

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

    const focusListener = navigation.addListener('focus', loadRecentSearches);

    return () => {
      focusListener();
    };
  }, [navigation]);

  const handleCitySelect = (city) => {
    navigation.navigate('Home', { selectedCity: city });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recentSearches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCitySelect(item)}>
            <Text style={styles.cityText}>{item.formattedName}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma pesquisa recente.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cityText: {
    fontSize: 18,
    paddingVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RecentSearchesScreen;