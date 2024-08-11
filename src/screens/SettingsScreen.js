import React from 'react';
import { View, Text, Switch } from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Configurações</Text>
      {/* Aqui você pode adicionar switches e botões para alterar as configurações do app */}
    </View>
  );
};

export default SettingsScreen;