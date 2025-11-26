import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useAuth();
  
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nombre || !password) {
      alert("Por favor introduce usuario y contraseña");
      return;
    }

    setLoading(true);
    try {
      await login(nombre, password);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          
          {/* Header con Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
               <Feather name="book-open" size={40} color="#2563eb" />
            </View>
            <Text style={styles.title}>¡Hola de nuevo!</Text>
            <Text style={styles.subtitle}>Bienvenido a <Text style={styles.brandName}>Knowlia</Text></Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usuario</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#2563eb" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Introduce tu usuario" 
                  placeholderTextColor="#cbd5e1"
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#2563eb" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="••••••••" 
                  placeholderTextColor="#cbd5e1"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.btnLogin} 
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>


        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8fafc" },
  
  bgCircle1: { position: 'absolute', top: -100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#b7e0fcff', opacity: 0.5 },
  bgCircle2: { position: 'absolute', top: 50, right: -190, width: 250, height: 250, borderRadius: 125, backgroundColor: '#e1f2fdff', opacity: 0.6 },

  container: { flex: 1, justifyContent: "center" },
  content: { padding: 30 },

  header: { alignItems: "center", marginBottom: 40 },
  logoContainer: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: "#2563eb", shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
  title: { fontSize: 30, fontWeight: "800", color: "#1e293b", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#64748b" },
  brandName: { color: "#2563eb", fontWeight: "700" },

  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#1e293b", marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", height: 56, paddingHorizontal: 16, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#1e293b", height: '100%' },

  btnLogin: { backgroundColor: "#2563eb", height: 58, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 25, shadowColor: "#2563eb", shadowOpacity: 0.3, shadowOffset: {width:0, height:8}, shadowRadius: 12, elevation: 6 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 },

});