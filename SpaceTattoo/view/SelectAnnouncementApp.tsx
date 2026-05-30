import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export type Announcement = {
  id_announcemen: string;
  id_user_fk: number;
  title: string;
  valor: string;
  info: string;
  local: boolean;
  prest_serv: boolean;
  imag1?: string;
  imag2?: string;
  imag3?: string;
};

export default function SelectAnnouncement() {
  const navigation = useNavigation<any>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await supabase
        .from('announcement')
        .select('id_announcemen, id_user_fk, title, valor, info, local, prest_serv, imag1, imag2, imag3');
      
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

  const renderBase64Image = (base64Str: string | null | undefined) => {
    if (!base64Str) return null;
    
    // If it's already a full data URI, return it
    if (base64Str.startsWith('data:image')) {
      return { uri: base64Str };
    }

    // Normalize and clean hex string from Postgres bytea
    let cleanHex = base64Str;
    if (cleanHex.startsWith('\\\\x')) {
      cleanHex = cleanHex.substring(3);
    } else if (cleanHex.startsWith('\\x')) {
      cleanHex = cleanHex.substring(2);
    } else if (cleanHex.startsWith('x')) {
      cleanHex = cleanHex.substring(1);
    }

    // Check if the cleaned string is indeed a hex string
    const isHex = /^[0-9a-fA-F]+$/.test(cleanHex);
    
    if (isHex && cleanHex.length > 0) {
      try {
        // Detect magic bytes to choose correct MIME type
        let mimeType = 'image/png'; // default fallback
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

        // Convert byte array to Base64
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

        return { uri: `data:${mimeType};base64,${base64}` };
      } catch (error) {
        console.error('Error converting hex to base64:', error);
      }
    }

    // Default fallback: assume it is a raw base64 string
    return { uri: `data:image/png;base64,${base64Str}` };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6A00" />
        <Text style={styles.loadingText}>Carregando anúncios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {announcements.length === 0 ? (
          <Text style={styles.emptyText}>Não foram encontrados anúncios.</Text>
        ) : (
          announcements.map((announcement) => {
            const imageSource = renderBase64Image(announcement.imag1);
            return (
              <TouchableOpacity 
                key={announcement.id_announcemen} 
                style={styles.card}
                onPress={() => navigation.navigate('AnnouncementView', { announcement })}
              >
                <View style={styles.imageContainer}>
                  {imageSource ? (
                    <Image source={imageSource} style={styles.cardImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>Sem Foto</Text>
                    </View>
                  )}
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.title} numberOfLines={2}>{announcement.title}</Text>
                  
                  <Text style={styles.price}>
                    {announcement.valor ? `R$ ${announcement.valor}` : 'Combinar'}
                  </Text>

                  <View style={styles.tagContainer}>
                    {announcement.prest_serv && (
                      <View style={[styles.tag, styles.tagServ]}>
                        <Text style={styles.tagText}>Serviço</Text>
                      </View>
                    )}
                    {announcement.local && (
                      <View style={[styles.tag, styles.tagLocal]}>
                        <Text style={styles.tagText}>Local</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height: 110,
  },
  imageContainer: {
    width: 110,
    height: 110,
    backgroundColor: '#eaeaea',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
  },
  placeholderText: {
    color: '#777',
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 18,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FF6A00', // OLX Style orange
    marginVertical: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagServ: {
    backgroundColor: '#E3F2FD',
  },
  tagLocal: {
    backgroundColor: '#E8F5E9',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
});
