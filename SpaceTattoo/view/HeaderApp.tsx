import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { User as UserIcon, Search } from 'lucide-react-native';
import { Styles } from "../(tabs)/StylesApp";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header({ navigation }: { navigation: any }) {
    const handlePressUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('userData');
            if (storedUser) {
                navigation.navigate('User');
            } else {
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error("Erro ao verificar login no Header:", error);
            navigation.navigate('Login');
        }
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.searchContainerLogo}>
                <Text style={Styles.logo}>SpaceTattoo</Text>
                <TouchableOpacity style={Styles.buttonLogin} onPress={handlePressUser}>
                    <UserIcon color='#fff' />
                </TouchableOpacity>
            </View>

            <View style={Styles.searchContainer}>
                <TextInput placeholder='Procurar' style={Styles.input} placeholderTextColor={'#999'} />
                <TouchableOpacity style={Styles.button}>
                    <Search color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    );
}