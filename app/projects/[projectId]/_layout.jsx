import { Tabs, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function ProjectTabsLayout() {
  const { projectId } = useLocalSearchParams(); // Get projectId from params

  // console.log("From ProjectTabsLayout.jsx: ", projectId);

  if (!projectId) {
    console.error("No projectId provided in route params");
    return null; // Ensure that projectId is available
  }

  return (
    <Tabs
      screenOptions={{
        headerLeft: () => <DrawerToggleButton tintColor='#000' />,  // Ensure DrawerToggleButton is always visible
        headerTitleAlign: 'center',  // Center the header title for consistency
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen 
        name="home" 
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          tabBarLabel: 'Home',
          headerTitle: 'Project Home',
        }}
        initialParams={{ projectId }} // Pass projectId to home tab
      />

      {/* Map Tab */}
      <Tabs.Screen 
        name="map" 
        options={{
          tabBarIcon: ({ color }) => <Feather name="map" size={24} color={color} />,
          tabBarLabel: 'Map',
          headerTitle: 'Map',
        }}
        initialParams={{ projectId }} // Pass projectId to map tab
      />

      {/* QR Code Scanner Tab */}
      <Tabs.Screen 
        name="qr" 
        options={{
          tabBarIcon: ({ color }) => <Feather name="camera" size={24} color={color} />,
          tabBarLabel: 'QR',
          headerTitle: 'QR Code Scanner',
        }}
        initialParams={{ projectId }} // Pass projectId to QR tab
      />
    </Tabs>
  );
}