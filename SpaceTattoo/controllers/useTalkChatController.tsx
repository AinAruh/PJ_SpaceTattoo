import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Mensagem {
  id: string;
  remetente: string;
  timestamp: string;
  texto: string;
  id_env: number;  
  id_user: number; 
}

export function useTalkChatController(chatId: string) {
  const [conversas, setConversas] = useState<Mensagem[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [user, setUser] = useState<any>(null);
  const [relation, setRelation] = useState<any>(null);
  const [names, setNames] = useState<Map<number, string>>(new Map());

  // 1. Carrega dados do usuário logado
  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    getUser();
  }, []);

  // 1.2. Carrega a relação de chat
  useEffect(() => {
    const fetchRelation = async () => {
      if (!user || !chatId) return;
      const { data, error } = await supabase
        .from('chat_relation')
        .select('id_env1, id_env2, id_announcement_fk')
        .eq('id_chat', parseInt(chatId))
        .single();
      
      if (error) {
        console.error('Erro ao carregar relação do chat:', error);
      } else {
        setRelation(data);
      }
    };
    fetchRelation();
  }, [user, chatId]);

  // 1.3. Carrega os nomes reais dos participantes
  useEffect(() => {
    const fetchNames = async () => {
      if (!relation) return;
      const { data, error } = await supabase
        .from('users')
        .select('id_user, name')
        .in('id_user', [relation.id_env1, relation.id_env2]);
      
      if (!error && data) {
        const namesMap = new Map<number, string>();
        data.forEach((u: any) => namesMap.set(u.id_user, u.name));
        setNames(namesMap);
      }
    };
    fetchNames();
  }, [relation]);

  // 2. Busca o histórico de conversas
  const carregarConversas = async () => {
    if (!user) return;

    let chatIds = [parseInt(chatId)];
    if (relation) {
      const { data: relations } = await supabase
        .from('chat_relation')
        .select('id_chat')
        .or(`and(id_env1.eq.${relation.id_env1},id_env2.eq.${relation.id_env2}),and(id_env1.eq.${relation.id_env2},id_env2.eq.${relation.id_env1})`);
      if (relations && relations.length > 0) {
        chatIds = relations.map((r: any) => r.id_chat);
      }
    }
    
    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .in('id_chat_fk', chatIds)
      .order('time', { ascending: true });

    if (error) {
      console.error('Erro ao carregar mensagens:', error);
      return;
    }

    const mapped = (data ?? []).map((msg: any, index: number) => {
      const remetenteNome = msg.id_env_orig === user.id_user 
        ? 'Você' 
        : (names.get(msg.id_env_orig) || `Usuário ${msg.id_env_orig}`);

      return {
        id: `${msg.id_chat_fk}_${msg.time || index}`,
        remetente: remetenteNome,
        timestamp: msg.time,
        texto: msg.mensagem,
        id_env: msg.id_env_orig,
        id_user: msg.id_env_orig,
      };
    });

    setConversas(mapped);
    
    // Salva localmente para persistência offline ou cache imediato
    await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(mapped));
  };

  // 3. Dispara a mensagem para a tabela do Supabase
  const enviarMensagem = async () => {
    if (!mensagem.trim() || !user || !relation) return;

    const destUser = user.id_user === relation.id_env1 ? relation.id_env2 : relation.id_env1;

    const novaMensagem = {
      id_chat_fk: parseInt(chatId),
      id_announcemen_fk: relation.id_announcement_fk,
      id_env_orig: user.id_user,
      id_env_dest: destUser,
      mensagem: mensagem,
      time: new Date().toISOString(),
    };

    const { error } = await supabase.from('chat').insert(novaMensagem);
    if (error) {
      console.error('Erro ao enviar:', error);
      return;
    }

    setMensagem('');
    carregarConversas(); // Atualiza a lista imediatamente após o envio
  };

  // 4. Mecanismo de polling para buscar novas mensagens a cada 5 segundos
  useEffect(() => {
    if (user) {
      carregarConversas();
      const interval = setInterval(carregarConversas, 5000);
      return () => clearInterval(interval);
    }
  }, [user, chatId, names, relation]); // Inclui names e relation para recarregar caso os nomes ou a relação mudem

  return {
    conversas,
    mensagem,
    setMensagem,
    user,
    enviarMensagem,
  };
}