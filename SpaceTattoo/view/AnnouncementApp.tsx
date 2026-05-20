import React from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import FooterSelection from "./FooterApp";
import { useAnnouncementController } from '../controllers/useAnnouncementController';
import { supabase } from '../lib/supabase';

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
  } = useAnnouncementController();

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Categoria</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          {categories.map((category) => (
            <Picker.Item key={category.value} label={category.label} value={category.value} />
          ))}
        </Picker>

        <Text style={styles.label}>Anúncios</Text>
        <TextInput 
          placeholder="Novo anúncio" 
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descrição do anúncio</Text>
        <TextInput 
          placeholder="descrição do anúncio" 
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Valor do anúncio</Text>
        <TextInput 
          placeholder="Valor do anúncio" 
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />
        <TouchableOpacity style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center' }}
          onPress={useAnnouncementController().handleCreateAnnouncement}>
          <Text>Salvar Anúncio</Text>
        </TouchableOpacity>
      </View>
      <FooterSelection FooterSelection={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});