import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { usePathname, router } from "expo-router";
import { globalStyles } from './styles';
import { DataProvider } from './context/DataContext';

const participant_username = "maud_helen_longusernameexample"; // Replace this with dynamic data

const CustomDrawerContent = (props) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current Path", pathname);
  }, [pathname]);

  return (
    <DataProvider>
      <DrawerContentScrollView {...props}>
        {/* App Name Section */}
        <View style={[globalStyles.appNameContainer, styles.darkPinkBackground]}>
          <Text style={[globalStyles.appName, styles.whiteText]}>StoryPath</Text>
        </View>

        {/* Horizontal Line */}
        <View style={globalStyles.separatorLine} />

        {/* User Info Section */}
        <View style={[globalStyles.userInfoContainer, styles.darkPinkBackground]}>
          <Feather name="user" size={32} color="#fff" />
          <Text style={[globalStyles.usernameText, styles.whiteText]}>
            Current User: {participant_username}
          </Text>
        </View>

        {/* Drawer Items */}
        <DrawerItem
          icon={({ color, size }) => (
            <Feather
              name="home"
              size={size}
              color={pathname === "/" ? "#fff" : "#ff69b4"}  // Dark pink
            />
          )}
          label={"Welcome"}
          labelStyle={[
            globalStyles.navItemLabel,
            { color: pathname === "/" ? "#fff" : "#ff69b4" },
          ]}
          style={[
            globalStyles.drawerItemStyle,
            { backgroundColor: pathname === "/" ? "#ff69b4" : "#fff" },
          ]}
          onPress={() => {
            router.push("/");
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Feather
              name="user"
              size={size}
              color={pathname === "/profile" ? "#fff" : "#ff69b4"}
            />
          )}
          label={"Profile"}
          labelStyle={[
            globalStyles.navItemLabel,
            { color: pathname === "/profile" ? "#fff" : "#ff69b4" },
          ]}
          style={[
            globalStyles.drawerItemStyle,
            { backgroundColor: pathname === "/profile" ? "#ff69b4" : "#fff" },
          ]}
          onPress={() => {
            router.push("/profile");
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Feather
              name="folder"
              size={size}
              color={pathname.startsWith("/projects") ? "#fff" : "#ff69b4"}
            />
          )}
          label={"Projects"}
          labelStyle={[
            globalStyles.navItemLabel,
            { color: pathname.startsWith("/projects") ? "#fff" : "#ff69b4" },
          ]}
          style={[
            globalStyles.drawerItemStyle,
            { backgroundColor: pathname.startsWith("/projects") ? "#ff69b4" : "#fff" },
          ]}
          onPress={() => {
            router.push("/projects");
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Feather
              name="smile"
              size={size}
              color={pathname === "/about" ? "#fff" : "#ff69b4"}
            />
          )}
          label={"About"}
          labelStyle={[
            globalStyles.navItemLabel,
            { color: pathname === "/about" ? "#fff" : "#ff69b4" },
          ]}
          style={[
            globalStyles.drawerItemStyle,
            { backgroundColor: pathname === "/about" ? "#ff69b4" : "#fff" },
          ]}
          onPress={() => {
            router.push("/about");
          }}
        />
      </DrawerContentScrollView>
    </DataProvider>
  );
};

// Styles for dark pink color and text wrapping
const styles = StyleSheet.create({
  darkPinkBackground: {
    backgroundColor: '#ff69b4', 
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteText: {
    color: '#fff',
    flexWrap: 'wrap',
    flexShrink: 1,  // Allow text to shrink and wrap within the container
  },
});

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="index"
        options={{ headerShown: true, headerTitle: "Welcome" }}
      />
      <Drawer.Screen
        name="projects/index"
        options={{ headerShown: true, headerTitle: "Projects" }}
      />
      <Drawer.Screen
        name="profile"
        options={{ headerShown: true, headerTitle: "Profile" }}
      />
      <Drawer.Screen
        name="about"
        options={{ headerShown: true, headerTitle: "About" }}
      />
    </Drawer>
  );
}