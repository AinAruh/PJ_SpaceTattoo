import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar,
  Image,
  ActivityIndicator
} from "react-native";
import { Sparkles, Plus, Image as ImageIcon, Tag, FileText, Coins, Trash2 } from 'lucide-react-native';
import FooterSelection from "./FooterApp";
import { useAnnouncementController } from '../controllers/useAnnouncementController';

export default function Announcement({ navigation }: { navigation: any }) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    value,
    setValue,
    selectedCategory,
    setSelectedCategory,
    categories,
    img1,
    img2,
    img3,
    handleSelectImage,
    handleRemoveImage,
    handleCreateAnnouncement,
  } = useAnnouncementController();

  const [loading, setLoading] = useState(false);

  const handleCreateAnnouncementWithLoading = async () => {
    setLoading(true);
    await handleCreateAnnouncement();
    setLoading(false);
  };

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
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={styles.logoBadge}>
                <Sparkles size={28} color="#a855f7" />
              </View>
              <Text style={styles.logoText}>NOVO ANÚNCIO</Text>
              <Text style={styles.subtitleText}>Crie e publique sua obra-prima ou serviço no ecossistema SpaceTattoo.</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              
              {/* Category selector (Segmented Pill Tabs instead of standard Picker) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Anúncio (Categoria)</Text>
                <View style={styles.categoryContainer}>
                  {categories.map((category) => {
                    const isSelected = selectedCategory === category.value;
                    return (
                      <TouchableOpacity
                        key={category.value}
                        style={[
                          styles.categoryTab,
                          isSelected && styles.categoryTabSelected
                        ]}
                        onPress={() => setSelectedCategory(category.value)}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.categoryTabText,
                          isSelected && styles.categoryTabTextSelected
                        ]}>
                          {category.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Title Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título do Anúncio</Text>
                <View style={styles.inputWrapper}>
                  <Tag size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput 
                    placeholder="Ex: Flash Tattoo de Dragão Futurista" 
                    style={styles.input}
                    placeholderTextColor="#4b5563"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Informações / Descrição</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <FileText size={20} color="#6b7280" style={[styles.inputIcon, styles.textAreaIcon]} />
                  <TextInput 
                    placeholder="Detalhe o anúncio, materiais, estilo, tempo estimado..." 
                    style={[styles.input, styles.textArea]}
                    placeholderTextColor="#4b5563"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Price Value Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$)</Text>
                <View style={styles.inputWrapper}>
                  <Coins size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput 
                    placeholder="Valor estimado (ex: 350.00)" 
                    style={styles.input}
                    placeholderTextColor="#4b5563"
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Images Section (imag1, imag2, imag3 bytea schema) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Imagens do Anúncio (Máx 3)</Text>
                <Text style={styles.imageHelperText}>Toque nos slots para anexar imagens da sua galeria</Text>
                
                <View style={styles.imagesGrid}>
                  
                  {/* Image Slot 1 */}
                  <View style={styles.imageSlotContainer}>
                    <TouchableOpacity 
                      style={styles.imageSlot} 
                      onPress={() => handleSelectImage(1)}
                      activeOpacity={0.8}
                    >
                      {img1 ? (
                        <Image source={{ uri: img1 }} style={styles.imagePreview} />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <ImageIcon size={22} color="#a855f7" />
                          <Text style={styles.imageSlotLabel}>imag1</Text>
                          <View style={styles.plusIconBadge}>
                            <Plus size={10} color="#ffffff" />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                    {img1 && (
                      <TouchableOpacity 
                        style={styles.removeImageBadge} 
                        onPress={() => handleRemoveImage(1)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={12} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Image Slot 2 */}
                  <View style={styles.imageSlotContainer}>
                    <TouchableOpacity 
                      style={styles.imageSlot} 
                      onPress={() => handleSelectImage(2)}
                      activeOpacity={0.8}
                    >
                      {img2 ? (
                        <Image source={{ uri: img2 }} style={styles.imagePreview} />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <ImageIcon size={22} color="#a855f7" />
                          <Text style={styles.imageSlotLabel}>imag2</Text>
                          <View style={styles.plusIconBadge}>
                            <Plus size={10} color="#ffffff" />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                    {img2 && (
                      <TouchableOpacity 
                        style={styles.removeImageBadge} 
                        onPress={() => handleRemoveImage(2)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={12} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Image Slot 3 */}
                  <View style={styles.imageSlotContainer}>
                    <TouchableOpacity 
                      style={styles.imageSlot} 
                      onPress={() => handleSelectImage(3)}
                      activeOpacity={0.8}
                    >
                      {img3 ? (
                        <Image source={{ uri: img3 }} style={styles.imagePreview} />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <ImageIcon size={22} color="#a855f7" />
                          <Text style={styles.imageSlotLabel}>imag3</Text>
                          <View style={styles.plusIconBadge}>
                            <Plus size={10} color="#ffffff" />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                    {img3 && (
                      <TouchableOpacity 
                        style={styles.removeImageBadge} 
                        onPress={() => handleRemoveImage(3)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={12} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                  </View>

                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
                onPress={handleCreateAnnouncementWithLoading}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <View style={styles.buttonInner}>
                    <Text style={styles.buttonPrimaryText}>Salvar Anúncio</Text>
                    <Plus size={18} color="#ffffff" style={styles.arrowIcon} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Persistent Footer Navigation */}
      <FooterSelection FooterSelection={navigation} />
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
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 110,
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
    opacity: 0.12,
  },
  nebulaGlowRight: {
    position: 'absolute',
    bottom: 50,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#c084fc',
    opacity: 0.10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#12121a',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.15)',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 18,
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
    height: 52,
    backgroundColor: '#1c1c27',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    paddingHorizontal: 16,
  },
  textAreaWrapper: {
    height: 110,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    height: '100%',
  },
  textArea: {
    height: '100%',
  },
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: '#1c1c27',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  categoryTabSelected: {
    backgroundColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  categoryTabTextSelected: {
    color: '#ffffff',
  },
  imageHelperText: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 10,
    paddingLeft: 4,
  },
  imagesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  imageSlotContainer: {
    flex: 1,
    aspectRatio: 1,
    position: 'relative',
  },
  imageSlot: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1c1c27',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  imageSlotLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 4,
  },
  plusIconBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  buttonPrimary: {
    height: 52,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerCopyright: {
    color: '#4b5563',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 24,
  }
});