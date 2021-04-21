import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

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

	const [page, setPage] = useState(1);
	const [isLoadingMore, setIsLoadingMore] = useState(true);

	const [isLoading, setIsLoading] = useState(true);

	async function fetchPlants(){
		const { data } = await api
			.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

		if (!data) return setIsLoading(true);

		if (page > 1) {
			setPlants(oldValue => [...oldValue, ...data]);
			setFilteredPlants(oldValue => [...oldValue, ...data]);
		} else {
			setPlants(data);
			setFilteredPlants(data);
		}

		setIsLoading(false);
		setIsLoadingMore(false);
	}

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

	function handleFetchMore(distance: number) {
		if (distance < 1) return;
		setIsLoadingMore(true);
		setPage(oldValue => oldValue + 1);
		fetchPlants()
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
					onEndReachedThreshold={0.15}
					onEndReached={({distanceFromEnd}) => handleFetchMore(distanceFromEnd)}
					ListFooterComponent={
						isLoadingMore
						? <ActivityIndicator color={colors.green} />
						: <></>
					}
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