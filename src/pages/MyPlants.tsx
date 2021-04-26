import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, FlatList, Alert } from 'react-native';
import { loadPlant, PlantProps, removePlant, StoragePlantProps } from '../libs/storage';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import fonts from '../styles/fonts';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function MyPlants(){
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldData) => oldData.filter((item) => item.id !== plant.id));
          } catch (err) {
            Alert.alert('Não foi possível remover!')
          }
        },
      }
    ])
  }

  useEffect(() => {
    async function loadStoragedData() {
      const plantsStoraged = await loadPlant();
      if(plantsStoraged.length >= 1){
        const nextTime = formatDistance(
          new Date(plantsStoraged[0].dateTimeNotification).getTime(),
          new Date().getTime(),
          { locale: pt }
        );
  
        setNextWatered(`Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}`)
      } else {
        setNextWatered(`Adicione uma planta para receber seus lembretes!`)
      }
      setMyPlants(plantsStoraged);
      setIsLoading(false);
    }

    loadStoragedData();
  }, [])

  if (isLoading){
		return <Load />
	}
  return (
    <View style={styles.container}>
      <Header/>

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage}/>
        <Text style={styles.spotlightText}>
          {nextWatered}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>
        <FlatList 
          data={myPlants}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary 
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    fontFamily: fonts.heading,
    paddingHorizontal: 20
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  }
})