import React from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import FooterSelection from "./FooterApp";
import { useSelectChatController } from '../controllers/useSelectChatController';

export default function SelectChat({ navigation }: { navigation: any }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedChat,
    setSelectedChat,
    filteredChats,
  } = useSelectChatController();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar conversa..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ScrollView>
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={[
              styles.chatItem,
              selectedChat?.id === chat.id && styles.chatItemSelected
            ]}
            onPress={() => {
              setSelectedChat(chat);
              navigation.navigate('Talk_Chat', { chatId: chat.id });
            }}
          >
            <View style={styles.chatContent}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.chatMessage}>{chat.lastMessage}</Text>
            </View>
            
            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{chat.time}</Text>
              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <FooterSelection FooterSelection={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchInput: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', fontSize: 16 },
  chatItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between' },
  chatItemSelected: { backgroundColor: '#f0f0f0' },
  chatContent: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  chatMessage: { fontSize: 14, color: '#666' },
  chatMeta: { alignItems: 'flex-end', justifyContent: 'space-between' },
  chatTime: { fontSize: 12, color: '#999', marginBottom: 4 },
  unreadBadge: { backgroundColor: '#25d366', borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});