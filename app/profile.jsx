import React, { useState, useContext } from "react";
import { SafeAreaView, View, Image, Dimensions, Text, Button, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  photoFullView: {
    marginBottom: 20,
  },
  photoEmptyView: {
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#ff69b4",
    borderStyle: "dashed",
    width: "100%",
    height: height / 2,
    marginBottom: 20,
  },
  photoFullImage: {
    width: "100%",
    height: height / 2,
    borderRadius: 10,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#ff69b4",
    color: "#fff",
  },
});

export default function Profile() {
  const [photoState, setPhotoState] = useState({});

  async function handleChangePress() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setPhotoState(selectedImage);
    }
  }

  function handleRemovePress() {
    setPhotoState({});
  }

  const hasPhoto = Boolean(photoState.uri);

  function Photo() {
    return hasPhoto ? (
      <View style={styles.photoFullView}>
        <Image
          style={styles.photoFullImage}
          resizeMode="cover"
          source={{ uri: photoState.uri }}
        />
      </View>
    ) : (
      <View style={styles.photoEmptyView} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Photo />
      <View style={styles.buttonView}>
        <Button
          onPress={handleChangePress}
          title={hasPhoto ? "Change Photo" : "Add Photo"}
          color="#ff69b4"
        />
        {hasPhoto && <Button onPress={handleRemovePress} title="Remove Photo" color="#ff69b4" />}
      </View>
    </SafeAreaView>
  );
}