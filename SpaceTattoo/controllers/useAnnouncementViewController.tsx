import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Modelo de dados (Model)
export type Announcement = {
  id_announcemen: string;
  id_user_fk: number;
  title: string;
  info: string;
  valor?: string;
  local?: boolean;
  prest_serv?: boolean;
  image?: string;
};

export function useAnnouncementViewController() {
  const navigation = useNavigation<any>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Busca os anúncios cadastrados no banco
      const { data, error } = await supabase
        .from('announcement')
        .select('id_announcemen, id_user_fk, title, info, valor, local, prest_serv');

      if (error) throw error;

      setAnnouncements(data ?? []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (authorId: number, announcementId: number) => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        alert('Você precisa estar logado para iniciar uma conversa.');
        return;
      }
      const user = JSON.parse(storedUser);
      const myId = user.id_user;

      if (myId === authorId) {
        alert('Você não pode iniciar um chat com seu próprio anúncio.');
        return;
      }

      // 1. Verificar se já existe uma chat_relation para esse par de usuários e anúncio
      const { data: existingRelation, error: checkError } = await supabase
        .from('chat_relation')
        .select('id_chat')
        .or(`and(id_env1.eq.${myId},id_env2.eq.${authorId}),and(id_env1.eq.${authorId},id_env2.eq.${myId})`)
        .eq('id_announcement_fk', announcementId)
        .maybeSingle();

      if (existingRelation) {
        // Se já existe, navega direto para o chat
        navigation.navigate('Talk_Chat', { chatId: existingRelation.id_chat });
        return;
      }

      // 2. Se não existe, cria uma nova relação
      const { data: newRelation, error: insertError } = await supabase
        .from('chat_relation')
        .insert({
          id_env1: myId,
          id_env2: authorId,
          id_announcement_fk: announcementId,
        })
        .select('id_chat')
        .single();

      if (insertError) {
        throw insertError;
      }

      if (newRelation) {
        navigation.navigate('Talk_Chat', { chatId: newRelation.id_chat });
      }
    } catch (error: any) {
      console.error('Erro ao iniciar chat:', error.message || error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Filtra os anúncios dinamicamente se você quiser colocar uma barra de busca
  const filteredAnnouncements = announcements.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    announcements: filteredAnnouncements,
    loading,
    searchQuery,
    setSearchQuery,
    refreshAnnouncements: fetchAnnouncements,
    handleStartChat,
  };
}