import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Modelo de dados (Model)
export type Announcement = {
  id_announcement: string;
  title: string;
  info: string;
  image: string;
};

export function useAnnouncementViewController() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Busca os anúncios cadastrados no banco
      const { data, error } = await supabase
        .from('announcement')
        .select('id_announcement, title, info, image');

      if (error) throw error;

      setAnnouncements(data ?? []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    } finally {
      setLoading(false);
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
    refreshAnnouncements: fetchAnnouncements
  };
}