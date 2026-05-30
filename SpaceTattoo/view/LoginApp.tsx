import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StatusBar, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react-native';
import { useLoginController } from '../controllers/useLoginController';

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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#07070a" />
      
      {/* Cosmic Nebula Glow Effect */}
      <View style={styles.nebulaGlowLeft} pointerEvents="none" />
      <View style={styles.nebulaGlowRight} pointerEvents="none" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Logo & Header */}
            <View style={styles.headerContainer}>
              <View style={styles.logoBadge}>
                <Sparkles size={28} color="#a855f7" />
              </View>
              <Text style={styles.logoText}>SPACE TATTOO</Text>
              <Text style={styles.subtitleText}>A arte cósmica na sua pele.</Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
              <Text style={styles.cardSubtitle}>Entre na sua conta para continuar</Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail, CPF ou Usuário</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput 
                    placeholder='Ex: astronauta@space.com' 
                    style={styles.input} 
                    placeholderTextColor='#4b5563' 
                    value={email} 
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput 
                    placeholder='Sua senha secreta' 
                    style={styles.input} 
                    placeholderTextColor='#4b5563' 
                    secureTextEntry={!showPassword} 
                    value={password} 
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Action Button */}
              <TouchableOpacity 
                style={[styles.buttonPrimary, loading && styles.buttonDisabled]} 
                onPress={handleLogin} 
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <View style={styles.buttonInner}>
                    <Text style={styles.buttonPrimaryText}>Acessar Espaço</Text>
                    <ArrowRight size={18} color="#ffffff" style={styles.arrowIcon} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Register Action Button */}
              <TouchableOpacity 
                style={styles.buttonSecondary} 
                onPress={handleGoToRegister}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonSecondaryText}>Criar Nova Conta</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Text */}
            <Text style={styles.footerCopyright}>© {new Date().getFullYear()} SpaceTattoo Studio</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07070a',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    zIndex: 1,
  },
  nebulaGlowLeft: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#a855f7',
    opacity: 0.15,
  },
  nebulaGlowRight: {
    position: 'absolute',
    bottom: -50,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#c084fc',
    opacity: 0.12,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#12121a',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.15)',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    backgroundColor: '#1c1c27',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  buttonPrimary: {
    height: 54,
    backgroundColor: '#a855f7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#6b21a8',
    opacity: 0.7,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2e2e3e',
  },
  dividerText: {
    color: '#6b7280',
    paddingHorizontal: 12,
    fontSize: 13,
  },
  buttonSecondary: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#2e2e3e',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonSecondaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  footerCopyright: {
    color: '#4b5563',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
  }
});