import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { useUserController } from '../controllers/useUserController';
import { Mail, BookOpen, Settings, LogOut, CheckCircle, Award } from 'lucide-react-native';

export default function User() {
  const {
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
    handleUpdateProfile,
    handleLogout,
  } = useUserController();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Header do Perfil */}
      <View style={styles.headerSection}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        
        {isEditing ? (
          <View style={styles.inputGroupHeader}>
            <TextInput 
              placeholder='Nome do Usuário' 
              style={[styles.input, styles.inputHeader]}
              value={name}
              onChangeText={setName}
              placeholderTextColor='#888'
            />
          </View>
        ) : (
          <Text style={styles.userName}>{name || 'Carregando...'}</Text>
        )}
        
        {!isEditing && <Text style={styles.userEmailSubtitle}>{email}</Text>}
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.contentSection}>
        {isEditing ? (
          /* MODO EDIÇÃO */
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Settings size={18} color="#FF6A00" style={styles.cardTitleIcon} />
              Editar Informações
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                placeholder='Email' 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor='#888'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Biografia</Text>
              <TextInput 
                placeholder='Escreva algo sobre você...' 
                style={[styles.input, styles.textArea]}
                value={descri}
                onChangeText={setDescri}
                multiline
                numberOfLines={4}
                placeholderTextColor='#888'
              />
            </View>

            {/* Divisor */}
            <View style={styles.divider} />

            <Text style={styles.label}>Modalidades / Preferências</Text>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Proprietário de Estúdio</Text>
              <Switch 
                value={prop}
                onValueChange={setProp}
                trackColor={{ false: '#3e3e3e', true: '#FF6A00' }}
                thumbColor={prop ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Prestador de Serviço / Tatuador</Text>
              <Switch 
                value={serv}
                onValueChange={setServ}
                trackColor={{ false: '#3e3e3e', true: '#FF6A00' }}
                thumbColor={serv ? '#fff' : '#f4f3f4'}
              />
            </View>

            {/* Botões do Modo de Edição */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* MODO VISUALIZAÇÃO */
          <View>
            {/* Card de Informações Básicas */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                <Mail size={18} color="#FF6A00" style={styles.cardTitleIcon} />
                Contato
              </Text>
              <Text style={styles.infoText}>{email || 'Sem e-mail cadastrado.'}</Text>
            </View>

            {/* Card de Biografia */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                <BookOpen size={18} color="#FF6A00" style={styles.cardTitleIcon} />
                Biografia
              </Text>
              <Text style={styles.infoText}>{descri || 'Escreva algo sobre você clicando em "Editar Perfil"!'}</Text>
            </View>

            {/* Card de Preferências / Tags */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                <Award size={18} color="#FF6A00" style={styles.cardTitleIcon} />
                Preferências
              </Text>
              
              <View style={styles.tagContainer}>
                <View style={[styles.tag, prop && styles.tagActive]}>
                  {prop && <CheckCircle size={14} color="#FF6A00" />}
                  <Text style={[styles.tagText, prop && styles.tagTextActive]}>Proprietário de Estúdio</Text>
                </View>

                <View style={[styles.tag, serv && styles.tagActive]}>
                  {serv && <CheckCircle size={14} color="#FF6A00" />}
                  <Text style={[styles.tagText, serv && styles.tagTextActive]}>Prestador de Serviço</Text>
                </View>
              </View>
            </View>

            {/* Botão de Editar Perfil */}
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            {/* Botão de Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={16} color="#FF3B30" />
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Ultra dark background theme
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 35,
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FF6A00', // Matches OLX orange theme
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  userEmailSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  contentSection: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2e2e2e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#3e3e3e',
  },
  tagActive: {
    borderColor: '#FF6A00',
    backgroundColor: 'rgba(255, 106, 0, 0.15)',
  },
  tagText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#FF6A00',
    fontWeight: '600',
  },
  inputGroupHeader: {
    width: '80%',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#bbb',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#3e3e3e',
    width: '100%',
  },
  inputHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#2a2a2a',
    borderColor: '#FF6A00',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2e2e2e',
  },
  switchLabel: {
    fontSize: 15,
    color: '#ddd',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2d2d2d',
    marginVertical: 16,
  },
  editButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
  },
});