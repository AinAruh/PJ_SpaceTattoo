import React from 'react';
import { Text, View, TextInput, ScrollView, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useAnnouncementViewController } from '../controllers/useAnnouncementViewController';

export default function AnnouncementView() {
  const { 
    announcements, 
    loading, 
    searchQuery, 
    setSearchQuery 
  } = useAnnouncementViewController();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Campo de busca caso queira filtrar os anúncios na View */}
      <TextInput
        placeholder="Buscar anúncios..."
        style={styles.inputBusca}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {announcements.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum anúncio disponível.</Text>
        ) : (
          announcements.map((item) => (
            <View key={item.id_announcement} style={styles.card}>
              {/* Renderiza a imagem apenas se ela existir */}
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : null}
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}>{item.info}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBusca: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  }
});