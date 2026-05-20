import { useNavigation } from '@react-navigation/native';

export function useFooterSelectionController() {
  const navigation = useNavigation<any>();

  const handleNavigateToInicio = () => {
    navigation.navigate('Inicio');
  };

  const handleNavigateToAnnouncement = () => {
    navigation.navigate('Announcement');
  };

  const handleNavigateToChat = () => {
    navigation.navigate('Chat');
  };

  return {
    handleNavigateToInicio,
    handleNavigateToAnnouncement,
    handleNavigateToChat,
  };
}