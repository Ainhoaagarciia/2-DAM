import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

// --- IMPORTS ---
import { PERMISSIONS } from '../config/permissions';
import { AuthProvider, useAuth } from '../context/AuthContext';

// --- PANTALLAS ---
import LoginScreen from '../screens/LoginScreen'; // <--- NUEVO LOGIN
// (RoleSelectionScreen ELIMINADO)

import AdminPanelScreen from '../screens/AdminPanelScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditVideoScreen from '../screens/EditVideoScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { FavoritosProvider } from '../screens/FavoritosProvider';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UploadScreen from '../screens/UploadScreen';
import VideoDetailsScreen from '../screens/VideoDetailScreen';
import VideosScreen from '../screens/VideosScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { can } = useAuth(); 

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20, 
          right: 20, 
          height: 72,
          elevation: 0,
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          borderRadius: 35,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                <Ionicons name={focused ? "home" : "home-outline"} size={27} color={focused ? "#fff" : "#64748b"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]}>Inicio</Text>
            </View>
          ),
        }}
      />

      {can(PERMISSIONS.ITEM_LIST) && (
        <Tab.Screen
          name="Videos"
          component={VideosScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                  <MaterialCommunityIcons name={focused ? "book-open-page-variant" : "book-open-page-variant-outline"} size={27} color={focused ? "#fff" : "#64748b"} />
                </View>
                <Text style={[styles.label, focused && styles.activeLabel]}>Vídeos</Text>
              </View>
            ),
          }}
        />
      )}

      {can(PERMISSIONS.ADMIN_PANEL_VIEW) && (
        <Tab.Screen
          name="AdminPanel"
          component={AdminPanelScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                  <MaterialCommunityIcons name="view-dashboard" size={27} color={focused ? "#fff" : "#64748b"} />
                </View>
                <Text style={[styles.label, focused && styles.activeLabel]}>Panel</Text>
              </View>
            ),
          }}
        />
      )}

      {can(PERMISSIONS.FAVORITES_USE) && (
        <Tab.Screen
          name="Favoritos"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                  <Feather name="bookmark" size={27} color={focused ? "#fff" : "#64748b"} />
                </View>
                <Text style={[styles.label, focused && styles.activeLabel]} numberOfLines={1}>Favoritos</Text>
              </View>
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                <Ionicons name={focused ? "person" : "person-outline"} size={27} color={focused ? "#fff" : "#64748b"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]}>Perfil</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="#2B74E4"/></View>;
  }

  return (
    <FavoritosProvider userId={user?.id || 0}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // SI NO HAY USUARIO, MOSTRAMOS LOGIN
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // SI HAY USUARIO, MOSTRAMOS LA APP
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="UploadScreen" component={UploadScreen} />
            <Stack.Screen name="VideoDetailsScreen" component={VideoDetailsScreen} />
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="VideosScreen" component={VideosScreen} />
            <Stack.Screen name="AdminPanelScreen" component={AdminPanelScreen} />
            <Stack.Screen name="EditVideoScreen" component={EditVideoScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </FavoritosProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65, 
    height: '100%',
    top: Platform.OS === 'ios' ? 10 : 16, 
  },
  iconBackground: {
    width: 40,
    height: 35, 
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3, // Separación justa con el texto
    backgroundColor: "transparent",
  },
  activeBackground: {
    backgroundColor: "#2B74E4", 
    shadowColor: "#2B74E4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    // CAMBIO 3: Fuente un poco más pequeña y legible
    fontSize: 12, 
    fontWeight: "600",
    color: "#94a3b8",
    textAlign: "center",
    width: "100%",
  },
  activeLabel: {
    color: "#2B74E4",
    fontWeight: "700",
  }
});