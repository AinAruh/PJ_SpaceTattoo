import React from 'react';
import { Text, View, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das suas Telas/Components
import Header from '../view/HeaderApp';
import FooterSelection from "../view/FooterApp";
import Login from '../view/LoginApp';
import Register from '../view/RegisterApp';
import Announcement from "../view/AnnouncementApp";
import Chat from "../view/SelectChatApp";
import Talk_Chat from '../view/TalkChatApp';
import AnnouncementView from '../view/AnnouncementDateilsApp';
import User from '../view/userApp';

// Importação do Controller
import { useAppController } from '../controllers/useAppController'; 

// Tipagem das rotas
type RootStackParamList = {
  Inicio: { user?: any };
  Login: undefined;
  Register: undefined;
  Announcement: undefined;
  Chat: undefined;
  Talk_Chat: { chatId: number };
  User: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { user, loading } = useAppController();

  // Tela de Loading enquanto verifica o AsyncStorage
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Inicio' : 'Login'}>
        <Stack.Screen 
          name="Inicio" 
          component={Inicio} 
          options={{ headerShown: false }} 
          initialParams={{ user }} 
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Announcement" component={Announcement} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Talk_Chat" component={Talk_Chat} />
        <Stack.Screen name="User" component={User} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Componente interno da tela de Início
function Inicio({ navigation, route }: { navigation: any; route: any }) {
  const { user } = route.params || {}; 
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Header navigation={navigation} />
        <AnnouncementView />
        <StatusBar />
      </View>
      <FooterSelection FooterSelection={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});