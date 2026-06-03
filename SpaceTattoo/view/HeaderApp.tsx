import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { User as UserIcon, Search, SlidersHorizontal } from 'lucide-react-native';
import { Styles } from "../(tabs)/StylesApp";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderProps {
    navigation: any;
    searchText?: string;
    setSearchText?: (text: string) => void;
    serviceType?: 'todos' | 'servico' | 'local';
    setServiceType?: (type: 'todos' | 'servico' | 'local') => void;
    maxPrice?: string;
    setMaxPrice?: (price: string) => void;
}

export default function Header({ 
    navigation,
    searchText = '',
    setSearchText = () => {},
    serviceType = 'todos',
    setServiceType = () => {},
    maxPrice = '',
    setMaxPrice = () => {},
}: HeaderProps) {
    const [showFilters, setShowFilters] = useState(false);

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
        <View style={[Styles.container, { paddingBottom: 15 }]}>
            <View style={Styles.searchContainerLogo}>
                <Text style={Styles.logo}>SpaceTattoo</Text>
                <TouchableOpacity style={Styles.buttonLogin} onPress={handlePressUser}>
                    <UserIcon color='#fff' />
                </TouchableOpacity>
            </View>

            <View style={Styles.searchContainer}>
                <TextInput 
                    placeholder='Procurar' 
                    style={Styles.input} 
                    placeholderTextColor={'#999'} 
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity style={[Styles.button, { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}>
                    <Search color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[Styles.button, { backgroundColor: showFilters ? '#a855f7' : '#1E1E1E' }]}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal color='#fff' size={20} />
                </TouchableOpacity>
            </View>

            {showFilters && (
                <View style={localStyles.filterOptionsContainer}>
                    {/* Tipo de Serviço Filter */}
                    <View style={localStyles.filterGroup}>
                        <Text style={localStyles.filterLabel}>Tipo de Serviço</Text>
                        <View style={localStyles.pillContainer}>
                            <TouchableOpacity 
                                style={[localStyles.pill, serviceType === 'todos' && localStyles.pillActive]} 
                                onPress={() => setServiceType('todos')}
                            >
                                <Text style={[localStyles.pillText, serviceType === 'todos' && localStyles.pillTextActive]}>Todos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[localStyles.pill, serviceType === 'servico' && localStyles.pillActive]} 
                                onPress={() => setServiceType('servico')}
                            >
                                <Text style={[localStyles.pillText, serviceType === 'servico' && localStyles.pillTextActive]}>Serviços</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[localStyles.pill, serviceType === 'local' && localStyles.pillActive]} 
                                onPress={() => setServiceType('local')}
                            >
                                <Text style={[localStyles.pillText, serviceType === 'local' && localStyles.pillTextActive]}>Locais</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Preço Máximo Filter */}
                    <View style={localStyles.filterGroup}>
                        <Text style={localStyles.filterLabel}>Preço Máximo (R$)</Text>
                        <TextInput 
                            placeholder="Ex: 500" 
                            placeholderTextColor="#666" 
                            keyboardType="numeric"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                            style={localStyles.priceInput}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const localStyles = StyleSheet.create({
  filterOptionsContainer: {
    marginTop: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#3b3b3b',
  },
  filterGroup: {
    flexDirection: 'column',
    gap: 6,
  },
  filterLabel: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pillContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3b3b3b',
  },
  pillActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  pillText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pillTextActive: {
    color: '#fff',
  },
  priceInput: {
    backgroundColor: '#2b2b2b',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3b3b3b',
  }
});