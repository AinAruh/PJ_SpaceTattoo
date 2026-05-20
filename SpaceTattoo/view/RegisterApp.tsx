import React from 'react';
import { Text, View, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { Styles, Background } from "../(tabs)/StylesApp";
import { useRegisterController } from '../controllers/useRegisterController'; // Importa o controller

export default function Register() {
  // Desestrutura todas as variáveis e funções vindas do Controller
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoToLogin
  } = useRegisterController();

  return (
    <View style={Background.backLogin}>
      <View style={Background.container}>
        
        <View style={Background.viewLogin}>
          <Text style={Styles.SizeText}>Informações do Usuário</Text>
          <TextInput 
            placeholder='Nome do Usuário:' 
            style={Background.input} 
            placeholderTextColor={'#b1acac'} 
            value={name} 
            onChangeText={setName} 
          />
        </View>

        <View style={Background.viewLogin}>
          <Text style={Styles.SizeText}>Email</Text>
          <TextInput 
            placeholder='Email:' 
            style={Background.input} 
            placeholderTextColor={'#b1acac'} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={Background.viewLogin}>
          <Text style={Styles.SizeText}>Senha</Text>
          <TextInput 
            placeholder='Informe sua senha:' 
            style={Background.input} 
            placeholderTextColor={'#b1acac'} 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
        </View>

        <View style={Background.searchContainer}>
          {/* Corrigido aqui: o botão de "Já tenho conta" agora aponta para a navegação de login */}
          <TouchableOpacity style={Background.buttonEntrar} onPress={handleGoToLogin} disabled={loading}>
            <Text>Já tenho Conta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={Background.buttonCadastro} onPress={handleRegister} disabled={loading}>
            <Text>{loading ? 'Cadastrando...' : 'Cadastro'}</Text>
          </TouchableOpacity>
        </View>

      </View>
      <StatusBar />
    </View>
  );
}