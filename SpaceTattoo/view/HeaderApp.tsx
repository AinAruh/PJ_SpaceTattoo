import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { User, Search } from 'lucide-react-native';
import { Styles } from "../(tabs)/StylesApp";


export default function Header({ navigation }: { navigation: any }) {
    return (
        <View style={Styles.container}>
            <View style={Styles.searchContainerLogo}>
                <Text style={Styles.logo}>SpaceTattoo</Text>
                <TouchableOpacity style={Styles.buttonLogin} onPress={() => navigation.navigate('Login')}>
                    <User color='#fff' />
                </TouchableOpacity>
            </View>

            <View style={Styles.searchContainer}>
                <TextInput placeholder='Procurar' style={Styles.input} placeholderTextColor={'#999'} />
                <TouchableOpacity style={Styles.button}>
                    <Search color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    );
}