import React from 'react';
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Toolbox, ArrowDownToLine, MailQuestionMark } from "lucide-react-native";
import { useFooterSelectionController } from '../controllers/useFooterController';

export default function FooterSelection({ FooterSelection }: { FooterSelection: any }) {
  const {
    handleNavigateToInicio,
    handleNavigateToAnnouncement,
    handleNavigateToChat,
  } = useFooterSelectionController();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateToInicio}>
        <Toolbox size={24} color="#000" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleNavigateToAnnouncement}>
        <ArrowDownToLine size={24} color="#000" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleNavigateToChat}>
        <MailQuestionMark size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    // Caso use posição absoluta no futuro, o estilo antigo está guardado aqui:
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
});