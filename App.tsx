import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
import Routes from './src/routes';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import { PlantProps } from './src/libs/storage';

export default function App() {
  const [ isFontLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
      }
    );
    
    async function getNotifications() {
      const data = await Notifications.getAllScheduledNotificationsAsync();
      console.log('data...', data)
    }

    getNotifications();
    return () => subscription.remove()
  }, [])
  
  if(!isFontLoaded)
    return <AppLoading />

  return (
    <Routes />
  )
}
