import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { useUserController } from '../controllers/useUserController';

export default function User() {
  const {
    name,
    setName,
    email,
    setEmail,
    avatarUrl,
    handleLogout,
  } = useUserController();

  return (
    <View style={styles.container}>
      {/* Metade de cima: Fundo com opacidade (pode ser usado para fechar ao clicar) */}
      <View style={styles.opacityArea} />

      {/* Metade de baixo: O painel do perfil */}
      <View style={styles.profileCard}>
        <Text style={styles.title}>Perfil do Usuário</Text>
        
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <TextInput 
            placeholder='Nome' 
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <TextInput 
          placeholder='Email' 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Cor escura transparente cobrindo tudo
  },
  opacityArea: {
    flex: 1, // Ocupa a primeira metade da tela
  },
  profileCard: {
    flex: 1, // Ocupa a outra metade da tela
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});