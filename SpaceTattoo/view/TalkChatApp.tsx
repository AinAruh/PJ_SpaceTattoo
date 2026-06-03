import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTalkChatController } from '../controllers/useTalkChatController';

export default function Talk_Chat({ route }: { route: any }) {
  const { chatId } = route.params;
  
  // Consome tudo diretamente da inteligência do Controller
  const {
    conversas,
    mensagem,
    setMensagem,
    user,
    enviarMensagem,
  } = useTalkChatController(chatId);

  return (
    
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Chat - Space Tattoo</Text>
        </View>

        <FlatList
          data={conversas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View 
              style={[
                styles.mensagem, 
                item.id_env === user?.id_user ? styles.userMensagem : styles.atendenteMensagem
              ]}
            >
              <Text style={styles.remetente}>{item.remetente || 'Usuário'}</Text>
              <Text style={styles.texto}>{item.texto}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          )}
          style={styles.scrollView}
        />

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            value={mensagem}
            onChangeText={setMensagem}
          />
          <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
            <Text style={styles.botaoTexto}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  mensagem: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMensagem: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  atendenteMensagem: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  remetente: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  botao: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});