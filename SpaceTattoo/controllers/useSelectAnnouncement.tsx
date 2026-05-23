import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Definindo o tipo/modelo do Anúncio (Model)
export type Announcement = {
  id_announcemen: string;
  title: string;
  info: string;
};

export function useSelectAnnouncementController() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await supabase.from('announcement').select('*');
      
      if (response.error) {
        throw response.error;
      }
      
      setAnnouncements(response.data ?? []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    refetch: fetchAnnouncements // Caso queira adicionar um "puxe para atualizar" no futuro
  };
}