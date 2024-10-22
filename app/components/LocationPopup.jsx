import React from 'react';
import { View, Modal, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';

export default function LocationPopup({ visible, location, onClose }) {
  const contentWidth = Dimensions.get('window').width;
  const maxHeight = Dimensions.get('window').height * 0.7; // Set max height to 70% of the screen

  if (!location) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            style={{ maxHeight }}  // Limit the scrollable area
          >
            {/* Location Name */}
            <Text style={styles.title}>{location.location_name}</Text>

            {/* Render HTML content */}
            <RenderHTML
              contentWidth={contentWidth - 40} // Adjust content width to fit the modal padding
              source={{ html: location.location_content }}
              tagsStyles={htmlStyles}
            />
            {/* Display the score form the location*/}
            <Text style={styles.title}>Score: {location.score_points}</Text>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40, // Add padding from top and bottom of the screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '90%',
    maxHeight: '80%', // Limit the maximum height of the popup
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden', // Prevent overflow
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff69b4',
    textAlign: 'center',
  },
  scrollView: {
    paddingBottom: 20, // Add padding at the bottom
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff69b4',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// HTML tag styles
const htmlStyles = {
  img: {
    width: '100%',
    height: 'auto',
    marginVertical: 10,
  },
  p: {
    fontSize: 16,
    marginVertical: 5,
  },
  h1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
  },
};