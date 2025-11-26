import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ROLE_PERMISSIONS } from '../config/permissions';

const API = 'http://10.0.2.2:3000';

interface AuthContextProps {
  user: any;
  // CAMBIO AQUÍ: nombre en vez de correo
  login: (nombre: string, contrasena: string) => Promise<void>; 
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user_session');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Error cargando sesión", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // --- LOGIN MODIFICADO ---
  const login = async (nombre: string, contrasena: string) => {
    try {
      const res = await fetch(`${API}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ENVIAMOS 'nombre' AL BACKEND
        body: JSON.stringify({ nombre, contrasena }) 
      });

      if (!res.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const userData = await res.json();

      // Asignar permisos dinámicamente
      const roleKey = userData.rol as 'estudiante' | 'profesor';
      const permissions = ROLE_PERMISSIONS[roleKey] || [];

      const userWithPerms = {
        ...userData,
        permissions: permissions
      };

      setUser(userWithPerms);
      await AsyncStorage.setItem('user_session', JSON.stringify(userWithPerms));
      
    } catch (error) {
      Alert.alert("Error de acceso", "Usuario o contraseña incorrectos.");
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user_session');
  };

  const can = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, can, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);