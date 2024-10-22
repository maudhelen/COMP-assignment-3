import React, { useState, useContext } from "react";
import { SafeAreaView, View, Image, Dimensions, Text, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { DataContext } from './context/DataContext';

const { width } = Dimensions.get("window");

export default function Profile() {
  const { user, setUser, userAvatar, setUserAvatar } = useContext(DataContext);
  const [photoState, setPhotoState] = useState(userAvatar ? { uri: userAvatar } : {});
  const [username, setUsername] = useState(user || '');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  async function handleChangePress() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setPhotoState(selectedImage);
      setUserAvatar(selectedImage.uri);  // Save the photo to context
    }
  }

  function handleRemovePress() {
    setPhotoState({});
    setUserAvatar('');  // Clear the photo from context
  }

  function handleSaveUsername() {
    setUser(username);
    setIsPopupVisible(true);  // Show the popup when username is saved
  }

  function closePopup() {
    setIsPopupVisible(false);
  }

  const hasPhoto = Boolean(photoState.uri);

  function Photo() {
    return hasPhoto ? (
      <View style={styles.photoFullView}>
        <Image
          style={styles.photoFullImage}
          source={{ uri: photoState.uri }}
        />
      </View>
    ) : (
      <View style={styles.photoEmptyView}>
        <Feather name="user" size={60} color="#ff69b4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
      </View>

      {/* Scrollable and keyboard-aware container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Centered Photo Display */}
          <View style={styles.photoContainer}>
            <Photo />
            <View style={styles.buttonView}>
              <Button
                onPress={handleChangePress}
                title={hasPhoto ? "Change Photo" : "Add Photo"}
                color="#ff69b4"
              />
              {hasPhoto && <Button onPress={handleRemovePress} title="Remove Photo" color="#ff69b4" />}
            </View>
          </View>

          {/* Username Input */}
          <View style={styles.usernameContainer}>
            <TextInput
              style={styles.usernameInput}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
            <TouchableOpacity onPress={handleSaveUsername} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={closePopup}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>Username Saved!</Text>
            <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
              <Feather name="x" size={24} color="#ff69b4" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoFullView: {
    marginBottom: 10,
    width: width / 2.5,
    height: width / 2.5,
    borderRadius: width / 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: "#ff69b4",
  },
  photoEmptyView: {
    borderWidth: 3,
    borderRadius: width / 5,
    borderColor: "#ff69b4",
    borderStyle: "dashed",
    width: width / 2.5,
    height: width / 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoFullImage: {
    width: "100%",
    height: "100%",
    borderRadius: width / 5,  // Circular mask for the image
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 50,
  },
  usernameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ff69b4',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#ff69b4',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  popup: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  popupText: {
    fontSize: 18,
    color: '#ff69b4',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});