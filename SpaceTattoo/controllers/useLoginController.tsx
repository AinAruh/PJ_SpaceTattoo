import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Inicio: { user: any };
  Login: undefined;
  Register: undefined;
};

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Inicio'>;

export function useLoginController() {
  const navigation = useNavigation<LoginScreenProp>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password);
      
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
      return;
    } 

    if (!data || data.length === 0) {
      Alert.alert('Erro', 'E-mail ou senha inválidos');
      return;
    }
  
    await AsyncStorage.setItem('userData', JSON.stringify(data[0]));
    console.log('Usuário salvo:', data[0]);

    // Navega para a tela de início passando o usuário logado
    navigation.navigate('Inicio', { user: data[0] });
  };

  const handleGoToRegister = () => {
    // Como a rota 'Register' não está mapeada diretamente no LoginScreenProp para navegação estrita,
    // usamos o any ou simplesmente forçamos o nome da rota já cadastrada no Stack principal.
    navigation.navigate('Register' as any);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleGoToRegister,
  };
}