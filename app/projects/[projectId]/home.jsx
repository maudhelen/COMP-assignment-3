import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { globalStyles } from '../../styles';

export default function ProjectHome({ route }) {
  // Example project name, ideally passed from route params or state
  const projectName = "Project Alpha";  // Replace this with dynamic data

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Project Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{projectName}</Text>
      </View>

      {/* Instruction Box */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Instructions</Text>
        <Text style={styles.instructionContent}>
          Find the initial clue near the entrance of the park. You will need to solve it to move forward!
        </Text>
              {/* Bottom Boxes */}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomBox}>
            <Text style={styles.bottomBoxText}>Points 0 / 10</Text>
          </View>
          <View style={styles.bottomBox}>
            <Text style={styles.bottomBoxText}>Locations visited 0 / 3</Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionBox: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionContent: {
    fontSize: 16,
    color: '#555',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  bottomBox: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});