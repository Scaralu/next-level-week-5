import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TouchableOpacityProps
} from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonProps extends TouchableOpacityProps {
    text: string;
}

export function Button({ text, ...rest }: ButtonProps){
    return (
        <TouchableOpacity style={styles.button} {...rest}>
            <Text style={styles.buttonText}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.green,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.heading
    }
})
