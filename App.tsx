import React from 'react';
import AppLoading from 'expo-app-loading';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';

import Routes from './src/routes';

export default function App() {
  const [ isFontLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });
  
  if(!isFontLoaded)
    return <AppLoading />

  return (
    <Routes />
  )
}
