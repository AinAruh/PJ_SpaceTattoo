import React from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function AnnouncementView() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { announcement } = route.params || {};

  // Pega as imagens válidas/não-nulas em um array
  const images = [announcement?.imag1, announcement?.imag2, announcement?.imag3].filter(Boolean);

  const renderBase64Image = (base64Str: string | null | undefined) => {
    if (!base64Str) return null;
    if (base64Str.startsWith('data:image')) {
      return { uri: base64Str };
    }
    return { uri: `data:image/png;base64,${base64Str}` };
  };

  const handlePressChat = async () => {
    if (!announcement) return;

    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        alert('Você precisa estar logado para iniciar uma conversa.');
        return;
      }
      const user = JSON.parse(storedUser);
      const myId = user.id_user;

      if (myId === announcement.id_user_fk) {
        alert('Este anúncio é seu!');
        return;
      }

      // 1. Verificar se já existe uma chat_relation para esse par de usuários e anúncio
      const { data: existingRelation, error: checkError } = await supabase
        .from('chat_relation')
        .select('id_chat')
        .or(`and(id_env1.eq.${myId},id_env2.eq.${announcement.id_user_fk}),and(id_env1.eq.${announcement.id_user_fk},id_env2.eq.${myId})`)
        .eq('id_announcement_fk', announcement.id_announcemen)
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar chat_relation:', checkError);
      }

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
          id_env2: announcement.id_user_fk,
          id_announcement_fk: announcement.id_announcemen,
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

  if (!announcement) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Nenhum anúncio foi selecionado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Galeria de Fotos Swipeable */}
        <View style={styles.galleryContainer}>
          {images.length > 0 ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {images.map((img, idx) => {
                const src = renderBase64Image(img);
                return src ? (
                  <Image key={idx} source={src} style={styles.galleryImage} />
                ) : null;
              })}
            </ScrollView>
          ) : (
            <View style={styles.placeholderGallery}>
              <Text style={styles.placeholderGalleryText}>Sem fotos para este anúncio</Text>
            </View>
          )}
        </View>

        {/* Detalhes do Anúncio */}
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>
            {announcement.valor ? `R$ ${announcement.valor}` : 'Combinar'}
          </Text>
          
          <Text style={styles.title}>{announcement.title}</Text>

          {/* Categoria Tags */}
          <View style={styles.tagContainer}>
            {announcement.prest_serv && (
              <View style={[styles.tag, styles.tagServ]}>
                <Text style={styles.tagText}>Prestação de Serviço</Text>
              </View>
            )}
            {announcement.local && (
              <View style={[styles.tag, styles.tagLocal]}>
                <Text style={styles.tagText}>Local Físico</Text>
              </View>
            )}
          </View>

          {/* Divisor */}
          <View style={styles.divider} />

          {/* Descrição */}
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.infoText}>{announcement.info || 'Sem descrição.'}</Text>
        </View>
      </ScrollView>

      {/* Botão Fixo de Chat no Rodapé */}
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handlePressChat}>
          <Text style={styles.chatButtonText}>Conversar com Anunciante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  galleryContainer: {
    width: width,
    height: 250,
    backgroundColor: '#eaeaea',
  },
  galleryImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  placeholderGallery: {
    width: width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
  },
  placeholderGalleryText: {
    color: '#777',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 16,
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6A00', // OLX style orange
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 26,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tagServ: {
    backgroundColor: '#E3F2FD',
  },
  tagLocal: {
    backgroundColor: '#E8F5E9',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  footerButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chatButton: {
    backgroundColor: '#FF6A00', // Premium highlighted orange
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});