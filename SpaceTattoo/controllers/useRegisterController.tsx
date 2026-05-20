import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';

type RootStackParamList = {
  Inicio: undefined;
  Login: undefined;
  Register: undefined;
};

type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export function useRegisterController() {
  const navigation = useNavigation<RegisterScreenProp>();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('users').insert({
      email,
      password,
      name,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  // Retorna tudo o que a View vai precisar "consumir"
  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoToLogin
  };
}