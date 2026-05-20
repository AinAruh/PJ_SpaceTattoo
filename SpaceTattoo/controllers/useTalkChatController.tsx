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

  // 1. Carrega dados do usuário logado
  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    getUser();
  }, []);

  // 2. Busca o histórico de conversas
  const carregarConversas = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Erro ao carregar mensagens:', error);
      return;
    }

    setConversas(data ?? []);
    
    // Salva localmente para persistência offline ou cache imediato
    await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(data));
  };

  // 3. Dispara a mensagem para a tabela do Supabase
  const enviarMensagem = async () => {
    if (!mensagem.trim() || !user) return;

    const novaMensagem = {
      chat_id: chatId,
      id_env: user.id_user,
      texto: mensagem,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('messages').insert(novaMensagem);
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
  }, [user, chatId]);

  return {
    conversas,
    mensagem,
    setMensagem,
    user,
    enviarMensagem,
  };
}