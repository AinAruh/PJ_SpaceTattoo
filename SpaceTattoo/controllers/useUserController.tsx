import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

export interface UserProfile {
  id_user: number;
  name: string;
  email: string;
  descri: string;
  prop: boolean;
  serv: boolean;
  image_perfil?: string;
}

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

// Helper to convert hex to Base64 data URI
const hexToBase64 = (hexStr: string): string => {
  let cleanHex = hexStr;
  if (cleanHex.startsWith('\\\\x')) {
    cleanHex = cleanHex.substring(3);
  } else if (cleanHex.startsWith('\\x')) {
    cleanHex = cleanHex.substring(2);
  } else if (cleanHex.startsWith('x')) {
    cleanHex = cleanHex.substring(1);
  }

  const isHex = /^[0-9a-fA-F]+$/.test(cleanHex);
  if (!isHex || cleanHex.length === 0) return hexStr;

  try {
    let mimeType = 'image/png';
    if (cleanHex.startsWith('89504e47')) {
      mimeType = 'image/png';
    } else if (cleanHex.startsWith('ffd8ff')) {
      mimeType = 'image/jpeg';
    } else if (cleanHex.startsWith('47494638')) {
      mimeType = 'image/gif';
    } else if (cleanHex.startsWith('52494646')) {
      mimeType = 'image/webp';
    }

    const len = cleanHex.length;
    const bytes = new Uint8Array(len / 2);
    for (let i = 0; i < len; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let base64 = '';
    const bytesLength = bytes.length;
    for (let i = 0; i < bytesLength; i += 3) {
      const c1 = bytes[i];
      const c2 = i + 1 < bytesLength ? bytes[i + 1] : NaN;
      const c3 = i + 2 < bytesLength ? bytes[i + 2] : NaN;
      
      const byte1 = c1 >> 2;
      const byte2 = ((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4);
      const byte3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6);
      const byte4 = isNaN(c3) ? 64 : c3 & 63;
      
      base64 += chars.charAt(byte1) + chars.charAt(byte2) + 
                (byte3 === 64 ? '=' : chars.charAt(byte3)) + 
                (byte4 === 64 ? '=' : chars.charAt(byte4));
    }

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting hex to base64 in controller:', error);
    return hexStr;
  }
};

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
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
  const [avatarHex, setAvatarHex] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const parsed: any = JSON.parse(storedUser);
        setOriginalUser(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setDescri(parsed.descri || '');
        setProp(!!parsed.prop);
        setServ(!!parsed.serv);
        
        if (parsed.image_perfil) {
          setAvatarUrl(parsed.image_perfil);
          setOriginalAvatarUrl(parsed.image_perfil);
        }

        // Fetch fresh from Supabase to stay updated
        const { data, error } = await supabase
          .from('users')
          .select('name, email, descri, prop, serv, image_perfil')
          .eq('id_user', parsed.id_user)
          .single();
        
        if (data && !error) {
          setName(data.name || '');
          setEmail(data.email || '');
          setDescri(data.descri || '');
          setProp(!!data.prop);
          setServ(!!data.serv);
          
          let decodedAvatar = parsed.image_perfil;
          if (data.image_perfil) {
            decodedAvatar = hexToBase64(data.image_perfil);
            setAvatarUrl(decodedAvatar);
            setOriginalAvatarUrl(decodedAvatar);
          }

          // Sync fresh data back to AsyncStorage
          const updated = {
            ...parsed,
            name: data.name,
            email: data.email,
            descri: data.descri,
            prop: data.prop,
            serv: data.serv,
            image_perfil: decodedAvatar
          };
          await AsyncStorage.setItem('userData', JSON.stringify(updated));
        }
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
    setAvatarUrl(originalAvatarUrl);
    setAvatarHex(null);
    setIsEditing(false);
  };

  const handleSelectAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Precisamos da sua permissão para acessar a galeria de fotos!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const base64Data = asset.base64;
        const uri = asset.uri;

        if (base64Data) {
          const hex = base64ToHex(base64Data);
          setAvatarHex(hex);
        }
        setAvatarUrl(uri);
      }
    } catch (err: any) {
      alert("Erro ao selecionar imagem de perfil: " + (err.message || err));
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Nome e E-mail são obrigatórios.');
      return;
    }

    if (!originalUser) return;

    try {
      setLoading(true);

      const updateData: any = {
        name,
        email,
        descri,
        prop,
        serv,
      };

      if (avatarHex) {
        updateData.image_perfil = avatarHex;
      }

      // 1. Atualizar no banco de dados do Supabase
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id_user', originalUser.id_user);

      if (error) {
        throw error;
      }

      // 2. Atualizar no AsyncStorage mantendo os demais dados
      const updatedUser: any = {
        ...originalUser,
        name,
        email,
        descri,
        prop,
        serv,
        image_perfil: avatarUrl,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setOriginalUser(updatedUser);
      setOriginalAvatarUrl(avatarUrl);
      setAvatarHex(null);
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
    handleSelectAvatar,
    handleUpdateProfile,
    handleLogout,
  };
}