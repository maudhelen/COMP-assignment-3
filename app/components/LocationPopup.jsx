import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { getUniqueParticipantCountForLocation } from '../services/api';  // Define this in api.js

export default function LocationPopup({ visible, location, onClose }) {
  const contentWidth = Dimensions.get('window').width;
  const maxHeight = Dimensions.get('window').height * 0.7;
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    const fetchParticipantCount = async () => {
      if (location) {
        try {
          const count = await getUniqueParticipantCountForLocation(location.id, location.project_id);
          setParticipantCount(count);
        } catch (error) {
          console.error('Error fetching participant count:', error);
        }
      }
    };

    if (visible) fetchParticipantCount();
  }, [visible, location]);

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
            style={{ maxHeight }}
          >
            <Text style={styles.title}>{location.location_name}</Text>

            <RenderHTML
              contentWidth={contentWidth - 40}
              source={{ html: location.location_content }}
              tagsStyles={htmlStyles}
            />
            <Text style={styles.subtitle}>Score: {location.score_points}</Text>
            <Text style={styles.subtitle}>Participants: {participantCount}</Text>

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
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff69b4',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
    textAlign: 'center',
  },
  scrollView: {
    paddingBottom: 20,
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