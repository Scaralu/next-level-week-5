import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
	key: string;
	title: string;
}

interface PlantProps {
	id: string;
	name: string;
	about: string;
	water_tips: string;
	photo: string;
	environments: [string],
	frequency: {
		times: number;
		repeat_every: string
	}
}


export function PlantSelect() {
	const [environment, setEnvironment] = useState<EnvironmentProps[]>([]);
	const [environmentSelected, setEnvironmentSelected] = useState('all'); 


	const [plants, setPlants] = useState<PlantProps[]>([]);
	const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);

	const [isLoading, setIsLoading] = useState(true);

	function handleEnvironmentSelected(environmentKey: string) {
		setEnvironmentSelected(environmentKey);

		if (environmentKey == 'all') {
			return setFilteredPlants(plants);
		}

		const filtered = plants.filter(plant =>
			plant.environments.includes(environmentKey)
		)

		setFilteredPlants(filtered)
	}

	useEffect(() => {
		async function fetchEnvironment() {
			const { data } = await api
				.get('plants_environments?_sort=title&_order=asc');
			setEnvironment([
				{
					key: 'all',
					title: 'Todos'
				},
				...data
			]);
		}
		fetchEnvironment();	
	}, [])

	useEffect(() => {
		async function fetchPlants(){
			const { data } = await api
				.get('plants?_sort=name&_order=asc');
			setPlants(data);
			setFilteredPlants(data)
		}
		fetchPlants();
	}, [])


	if (isLoading){
		return <Load />
	}
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Header />
				<Text style={styles.title}>
					Em qual ambiente
				</Text>
				<Text style={styles.subTitle}>
					Você quer colocar sua planta?
				</Text>
			</View>
			<View>
				<FlatList
					horizontal
					showsHorizontalScrollIndicator={false}
					data={environment}
					renderItem={({ item }) => (
						<EnvironmentButton 
							title={item.title}
							active={item.key === environmentSelected}
							onPress={() => handleEnvironmentSelected(item.key)}
						/>
					)}
					contentContainerStyle={styles.environmentList}
				/>
			</View>
			<View style={styles.plants}>
				<FlatList 
					data={filteredPlants}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					renderItem={({ item }) => (
						<PlantCardPrimary 
							data={item}
						/>
					)}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		paddingHorizontal: 30,
	},
	title: {
		fontSize: 17,
		color: colors.heading,
		fontFamily: fonts.heading,
		lineHeight: 20,
		marginTop: 15,
	},
	subTitle: {
		fontFamily: fonts.text,
		fontSize: 17,
		lineHeight: 20,
		color: colors.heading,
	},
	environmentList: {
		height: 40,
		justifyContent: 'center',
		paddingBottom: 5,
		marginLeft: 32,
		marginVertical: 32,
	},
	plants: {
		flex: 1,
		paddingHorizontal: 32,
		justifyContent: 'center',
	},
})