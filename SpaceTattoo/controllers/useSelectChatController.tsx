import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
}

export function useSelectChatController() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  // 1. Carrega dados do usuário logado
  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    getUser();
  }, []);

  // 2. Inteligência de busca e agrupamento no banco de dados
  const carregarChats = async () => {
    if (!user) return;

    const { data: chatRelations, error: chatsError } = await supabase
      .from('chat_relation')
      .select('id_chat, id_env1, id_env2, id_announcement_fk')
      .or(`id_env1.eq.${user.id_user},id_env2.eq.${user.id_user}`);

    if (chatsError) {
      console.error('Erro ao buscar chat_relation:', chatsError);
      return;
    }

    // Agrupar por dupla de participantes (independente do anúncio)
    const chatsPorGrupo = new Map<string, any[]>();

    chatRelations.forEach((chat: any) => {
      const key = `${[chat.id_env1, chat.id_env2].sort((a, b) => a - b).join('_')}`;
      if (!chatsPorGrupo.has(key)) {
        chatsPorGrupo.set(key, []);
      }
      chatsPorGrupo.get(key)!.push(chat);
    });

    // Coleta todos os IDs dos outros participantes para buscar seus nomes
    const userIds = Array.from(new Set(chatRelations.map((chat: any) => 
      chat.id_env1 === user.id_user ? chat.id_env2 : chat.id_env1
    )));

    const usersMap = new Map<number, string>();
    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id_user, name')
        .in('id_user', userIds);

      if (!usersError && usersData) {
        usersData.forEach((u: any) => usersMap.set(u.id_user, u.name));
      }
    }

    // Busca assíncrona paralela da última mensagem de cada grupo
    const chatsComMensagens = await Promise.all(
      Array.from(chatsPorGrupo.values()).map(async (chatsDoGrupo: any[]) => {
        const chat = chatsDoGrupo[0];
        const outroParticipante = chat.id_env1 === user.id_user ? chat.id_env2 : chat.id_env1;
        const nomeOutro = usersMap.get(outroParticipante) || `Usuário ${outroParticipante}`;

        const { data: mensagens, error: msgError } = await supabase
          .from('chat')
          .select('mensagem, time, id_chat_fk')
          .in('id_chat_fk', chatsDoGrupo.map((c: any) => c.id_chat))
          .order('time', { ascending: false })
          .limit(1);

        if (msgError) {
          console.error('Erro ao buscar última mensagem:', msgError);
        }

        const ultimaMensagem = mensagens?.[0];

        return {
          id: chatsDoGrupo[0].id_chat, // Usamos o primeiro ID de chat do grupo como identificador
          name: nomeOutro,
          lastMessage: ultimaMensagem?.mensagem || 'Sem mensagens',
          time: ultimaMensagem?.time
            ? new Date(ultimaMensagem.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '',
          unread: 0,
          avatar: '',
        };
      })
    );

    setChats(chatsComMensagens);
    await AsyncStorage.setItem('userChats', JSON.stringify(chatsComMensagens));
  };

  // 3. Gerencia o fluxo de cache local e o polling (intervalo de atualização)
  useEffect(() => {
    const loadChats = async () => {
      const storedChats = await AsyncStorage.getItem('userChats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }

      if (user) {
        await carregarChats();
      }
    };
    loadChats();

    if (user) {
      const interval = setInterval(carregarChats, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // 4. Filtra os chats em memória reativamente com base na busca do usuário
  const filteredChats = useMemo(() => {
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedChat,
    setSelectedChat,
    filteredChats,
  };
}