import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import RecentSearchesScreen from './src/screens/RecentSearchesScreen';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          // Configuração dos ícones para cada aba
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Recentes') {
              iconName = focused ? 'time' : 'time-outline';
            }

            // Você pode usar qualquer biblioteca de ícones que preferir
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2f95dc',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Recentes" component={RecentSearchesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;