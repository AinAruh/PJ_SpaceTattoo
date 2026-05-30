import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

// Helper to convert base64 to Postgres bytea Hex format (\x...)
const base64ToHex = (base64String: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  
  const cleanBase64 = base64String.replace(/=/g, '');
  const len = cleanBase64.length;
  let bufferLength = Math.floor(len * 0.75);
  
  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const chunk = 
      (lookup[cleanBase64.charCodeAt(i)] << 18) |
      (lookup[cleanBase64.charCodeAt(i + 1)] << 12) |
      ((i + 2 < len ? lookup[cleanBase64.charCodeAt(i + 2)] : 0) << 6) |
      (i + 3 < len ? lookup[cleanBase64.charCodeAt(i + 3)] : 0);
      
    bytes[p++] = (chunk >> 16) & 255;
    if (i + 2 < len && p < bufferLength) bytes[p++] = (chunk >> 8) & 255;
    if (i + 3 < len && p < bufferLength) bytes[p++] = chunk & 255;
  }
  
  let hex = '\\x';
  for (let i = 0; i < p; i++) {
    const val = bytes[i].toString(16);
    hex += val.length === 1 ? '0' + val : val;
  }
  return hex;
};

export function useAnnouncementController() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  
  // Estados para controlar o formulário do anúncio
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Serviço');

  // Estados reais para as imagens (URI de visualização e Hex para Supabase)
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [img3, setImg3] = useState<string | null>(null);

  const [img1Hex, setImg1Hex] = useState<string | null>(null);
  const [img2Hex, setImg2Hex] = useState<string | null>(null);
  const [img3Hex, setImg3Hex] = useState<string | null>(null);

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

  // Função para selecionar imagem
  const handleSelectImage = async (slot: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Precisamos da sua permissão para acessar a galeria de fotos!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const base64Data = asset.base64;
        const uri = asset.uri;

        let hexData = null;
        if (base64Data) {
          hexData = base64ToHex(base64Data);
        }

        if (slot === 1) {
          setImg1(uri);
          setImg1Hex(hexData);
        } else if (slot === 2) {
          setImg2(uri);
          setImg2Hex(hexData);
        } else if (slot === 3) {
          setImg3(uri);
          setImg3Hex(hexData);
        }
      }
    } catch (err: any) {
      alert("Erro ao selecionar imagem: " + (err.message || err));
    }
  };

  // Função para remover imagem selecionada
  const handleRemoveImage = (slot: number) => {
    if (slot === 1) {
      setImg1(null);
      setImg1Hex(null);
    } else if (slot === 2) {
      setImg2(null);
      setImg2Hex(null);
    } else if (slot === 3) {
      setImg3(null);
      setImg3Hex(null);
    }
  };

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
        imag1: img1Hex || null,
        imag2: img2Hex || null,
        imag3: img3Hex || null,
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
      setImg1(null);
      setImg1Hex(null);
      setImg2(null);
      setImg2Hex(null);
      setImg3(null);
      setImg3Hex(null);

      // Navega para a tela inicial
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
    img1,
    img2,
    img3,
    handleSelectImage,
    handleRemoveImage,
    handleCreateAnnouncement
  };
}