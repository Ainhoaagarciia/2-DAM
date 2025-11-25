import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native'; // Importamos View, Text y StyleSheet

// Tus importaciones de pantallas
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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          // CAMBIO CLAVE: Aumentamos los márgenes laterales para encoger la barra
          left: 40,   
          right: 40,  
          height: 72,
          elevation: 0,
          width: 380,
          marginLeft: 15,
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          borderRadius: 35, // Más redondeado (casi circular en los bordes)
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
                <Ionicons name={focused ? "home" : "home-outline"} size={25} color={focused ? "#fff" : "#64748b"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]}>Inicio</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Videos"
        component={VideosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                <MaterialCommunityIcons name={focused ? "book-open-page-variant" : "book-open-page-variant-outline"} size={25} color={focused ? "#fff" : "#64748b"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]}>Videos</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                <Feather name="bookmark" size={25} color={focused ? "#fff" : "#64748b"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]} numberOfLines={1}>Favoritos</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, focused && styles.activeBackground]}>
                <Ionicons name={focused ? "person" : "person-outline"} size={25} color={focused ? "#fff" : "#64748b"} />
              </View>
              <Text style={[styles.label, focused && styles.activeLabel]}>Perfil</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    // Reduje un poco el ancho contenedor (de 70 a 60) para que quepan bien al estar más juntos
    width: 60, 
    height: '100%',
    // Mantenemos el ajuste para bajarlos visualmente
    top: Platform.OS === 'ios' ? 16 : 11, 
  },
  iconBackground: {
    width: 40,
    height: 35, 
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    backgroundColor: "transparent",
    marginTop: 12
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
    fontSize: 13, // Bajé la fuente a 9 para que no se vea apretado
    fontWeight: "500",
    color: "#94a3b8",
    textAlign: "center",
    width: '100%', 
  },
  activeLabel: {
    color: "#2B74E4",
    fontWeight: "700",
  }
});

export default function App() {
  return (
    <FavoritosProvider userId={2}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen name="VideoDetailsScreen" component={VideoDetailsScreen} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="VideosScreen" component={VideosScreen} />
      </Stack.Navigator>
    </FavoritosProvider>
  );
}