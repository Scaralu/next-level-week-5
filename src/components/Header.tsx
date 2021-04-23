import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import userImg from '../assets/minhaGata.jpg';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
	const [userName, setUserName] = useState<string>()

	useEffect(() => {
		async function getUserName() {
			const user = await AsyncStorage.getItem('@plantmanager:user')
			setUserName(user || '');
		}

		getUserName();
	}, [])

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.greetings}>Olá,</Text>
				<Text style={styles.userName}>{userName}</Text>
			</View>

			<Image source={userImg} style={styles.image}/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,
		marginTop: getStatusBarHeight(),
	},
	greetings: {
		fontSize: 32,
		color: colors.heading,
		fontFamily: fonts.text,
	},
	userName: {
		fontSize: 32,
		color: colors.heading,
		fontFamily: fonts.heading,
		lineHeight: 40,
	},
	image: {
		width: 70,
		height: 70,
		borderRadius: 40,
	}
});