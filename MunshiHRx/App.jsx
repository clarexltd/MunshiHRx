// App.js
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/colors';

const App = () => {
  return (
    <>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <AppNavigator />
      </SafeAreaView>
    </>
  );
};

export default App;