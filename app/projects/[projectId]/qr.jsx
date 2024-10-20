import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { globalStyles } from '../../styles';  // Import global styles
import { router } from 'expo-router';

export default function QRCodeScanner() {
  return (
    <SafeAreaView style={globalStyles.container}>
      
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("/projects")}
      >
        <Text style={globalStyles.buttonText}>Back to Projects List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}