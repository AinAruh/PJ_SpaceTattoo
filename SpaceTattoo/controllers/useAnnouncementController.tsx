import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAnnouncementController() {
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

    supabase.from('announcement').insert({
      title,
      info: description,
      valor: value,
      id_user_fk: user?.id_user ? parseInt(user.id_user) : null,
      prest_serv: isPrestServ,
      local: isLocal,
    }).then(() => {
      console.log("Anúncio criado com sucesso!");
    });

    console.log("Criando anúncio com:", { title, info: description, valor: value, selectedCategory });
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