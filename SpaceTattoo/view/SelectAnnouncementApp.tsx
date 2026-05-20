import { useState, useEffect } from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from '../lib/supabase';

type Announcement = {
    id_announcemen: string;
    title: string;
    info: string;
};

export default function SelectAnnouncement() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    // console.log(announcements);
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await supabase.from('announcement').select('*');
             if (response.error) {
                throw response.error;
            }
            setAnnouncements(response.data ?? []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {announcements.length === 0 ? (
                    <Text>Não foi encontrado anúncios.</Text>
                ):(announcements.map((announcement) => (
                    <View key={announcement.id_announcemen} style={styles.announcement}>
                        <Text style={styles.title}>{announcement.title}</Text>
                        <Text style={styles.description}>{announcement.info}</Text>
                    </View>
                )))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    announcement: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});
