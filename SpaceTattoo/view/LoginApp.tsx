import React from 'react';
import { Text, View, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { Styles, Background } from "../(tabs)/StylesApp";
import { useLoginController } from '../controllers/useLoginController'; // Importa o controller que criamos

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleGoToRegister,
  } = useLoginController();

  return (
    <View style={Background.backLogin}>
      <View style={Background.container}>
        
        <View style={Background.viewLogin}>
          <Text style={Styles.SizeText}>Informações do Usuário</Text>
          <TextInput 
            placeholder='E-mail, CPF ou Nome do Usuário:' 
            style={Background.input} 
            placeholderTextColor={'#b1acac'} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
          />
        </View>

        <View style={Background.viewLogin}>
          <Text style={Styles.SizeText}>Senha</Text>
          <TextInput 
            placeholder='Informe sua senha:' 
            style={Background.input} 
            placeholderTextColor={'#b1acac'} 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword}
          />
        </View>

        <View style={Background.searchContainer}>
          <TouchableOpacity 
            style={Background.buttonEntrar} 
            onPress={handleLogin} 
            disabled={loading}
          >
            <Text>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={Background.buttonCadastro} 
            onPress={handleGoToRegister}
          >
            <Text>Cadastro</Text>
          </TouchableOpacity>
        </View>

      </View>
      <StatusBar />
    </View>
  );
}