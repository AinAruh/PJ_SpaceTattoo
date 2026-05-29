import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id_user: number;
  name: string;
  email: string;
  descri: string;
  prop: boolean;
  serv: boolean;
}

export function useUserController() {
  const navigation = useNavigation<any>();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState<UserProfile | null>(null);

  // Estados dos inputs do perfil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [descri, setDescri] = useState('');
  const [prop, setProp] = useState(false);
  const [serv, setServ] = useState(false);
  const [avatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const parsed: UserProfile = JSON.parse(storedUser);
        setOriginalUser(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setDescri(parsed.descri || '');
        setProp(!!parsed.prop);
        setServ(!!parsed.serv);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário no perfil:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleCancel = () => {
    if (originalUser) {
      setName(originalUser.name || '');
      setEmail(originalUser.email || '');
      setDescri(originalUser.descri || '');
      setProp(!!originalUser.prop);
      setServ(!!originalUser.serv);
    }
    setIsEditing(false);
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Nome e E-mail são obrigatórios.');
      return;
    }

    if (!originalUser) return;

    try {
      setLoading(true);

      // 1. Atualizar no banco de dados do Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name,
          email,
          descri,
          prop,
          serv,
        })
        .eq('id_user', originalUser.id_user);

      if (error) {
        throw error;
      }

      // 2. Atualizar no AsyncStorage mantendo os demais dados
      const updatedUser: UserProfile = {
        ...originalUser,
        name,
        email,
        descri,
        prop,
        serv,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setOriginalUser(updatedUser);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      alert('Erro ao atualizar perfil: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    isEditing,
    setIsEditing,
    loading,
    name,
    setName,
    email,
    setEmail,
    descri,
    setDescri,
    prop,
    setProp,
    serv,
    setServ,
    avatarUrl,
    handleCancel,
    handleUpdateProfile,
    handleLogout,
  };
}