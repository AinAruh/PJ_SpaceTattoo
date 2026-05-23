import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useUserController() {
  const navigation = useNavigation<any>();
  
  // Estados para controlar as informações do perfil (editáveis)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setName(parsed.name || '');
          setEmail(parsed.email || '');
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário no perfil:", error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Limpa os dados do usuário para ele realmente sair do app
      await AsyncStorage.removeItem('userData');
      
      // Reseta a navegação para que o usuário não consiga voltar arrastando a tela
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    avatarUrl,
    handleLogout,
  };
}