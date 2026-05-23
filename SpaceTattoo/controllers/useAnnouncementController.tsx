import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export function useAnnouncementController() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  
  // Estados para controlar o formulário do anúncio
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Serviço');

  // Categorias fixas do Picker
  const categories = [
    { label: 'Serviço', value: 'prest_serv = true' },
    { label: 'Local', value: 'local = true' },
    { label: 'Outros', value: 'Outros' },
  ];

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    getUser();
  }, []);


  const handleCreateAnnouncement = async () => {
    const isPrestServ = selectedCategory === 'prest_serv = true';
    const isLocal = selectedCategory === 'local = true';

    try {
      const { error } = await supabase.from('announcement').insert({
        title,
        info: description,
        valor: value,
        id_user_fk: user?.id_user ? parseInt(user.id_user) : null,
        prest_serv: isPrestServ,
        local: isLocal,
      });

      if (error) {
        alert("Erro ao criar anúncio: " + error.message);
        return;
      }

      console.log("Anúncio criado com sucesso!");
      
      // Limpa os campos após a criação
      setTitle('');
      setDescription('');
      setValue('');

      // Navega para a tela inicial (onde está o AnnouncementView que lista os anúncios com botão do chat)
      navigation.navigate('Inicio');
    } catch (err: any) {
      console.error("Erro ao registrar anúncio:", err.message || err);
    }
  };

  return {
    user,
    title,
    setTitle,
    description,
    setDescription,
    value,
    setValue,
    selectedCategory,
    setSelectedCategory,
    categories,
    handleCreateAnnouncement
  };
}