import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../context/AuthContext";

const API = 'http://10.0.2.2:3000';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos actuales
  useEffect(() => {
    fetch(`${API}/usuario/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNombre(data.nombre);
        setCorreo(data.correo);
        setAvatarUrl(data.avatar_url);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "No se pudo cargar la información del perfil");
        navigation.goBack();
      });
  }, [user.id]);

  const handleUpdate = async () => {
    setSaving(true);
    
    const body = {
      nombre,
      correo,
      avatar_url: avatarUrl
    };

    try {
      const res = await fetch(`${API}/usuario/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        Alert.alert("¡Perfil Actualizado!", "Tus datos se han guardado correctamente.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "No se pudo actualizar el perfil.");
      }
    } catch (error) {
      Alert.alert("Error", "Fallo de conexión.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.centerLoading}><ActivityIndicator size="large" color="#2B74E4"/></View>;

  return (
    <View style={{flex: 1, backgroundColor: "#f8f9fc"}}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 50, paddingBottom: 100 }}>
          
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>EDITAR PERFIL</Text>
            <View style={{width: 40}} /> 
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg" }} 
                style={styles.avatarImage} 
              />
              <View style={styles.cameraIconBadge}>
                <Feather name="camera" size={16} color="#fff" />
              </View>
            </View>
            <Text style={styles.avatarHint}>Vista previa de tu foto</Text>
          </View>

          <View style={styles.formContainer}>
            
            <Text style={styles.label}>Nombre de Usuario</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#2B74E4" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={nombre} 
                onChangeText={setNombre} 
                placeholder="Tu nombre"
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color="#2B74E4" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={correo} 
                onChangeText={setCorreo} 
                keyboardType="email-address" 
                autoCapitalize="none"
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <Text style={styles.label}>URL de Foto de Perfil</Text>
            <View style={styles.inputWrapper}>
              <Feather name="image" size={20} color="#2B74E4" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={avatarUrl} 
                onChangeText={setAvatarUrl}
                placeholder="https://..."
                placeholderTextColor="#cbd5e1"
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.hintText}>Pega aquí un enlace directo a una imagen (jpg/png)</Text>

          </View>

          <TouchableOpacity 
            style={[styles.btnSave, { opacity: saving ? 0.7 : 1 }]} 
            onPress={handleUpdate}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                  <Feather name="save" size={20} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.btnText}>Guardar Cambios</Text>
                </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  headerTitle: { color: "#232323", 
    fontSize: 22, 
    fontWeight: "900", 
    letterSpacing: 1, 
    textShadowColor: "#aac6ffff", 
    textShadowOffset: { width: 0, height: 1.8 }, 
    textShadowRadius: 5  },
  
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff', backgroundColor: '#e2e8f0' },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2B74E4', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#f8f9fc' },
  avatarHint: { marginTop: 10, color: '#64748b', fontSize: 13 },

  formContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 25 },
  
  label: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#1e293b", 
    marginBottom: 10, 
    marginLeft: 4 
  },
  
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 50, 
    marginBottom: 25 
  },
  
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "#334155", fontSize: 16, height: '100%' },
  hintText: { fontSize: 12, color: "#94a3b8", marginBottom: 20, marginLeft: 4, marginTop: -5 },

  btnSave: { backgroundColor: "#2B74E4", flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: "center", justifyContent: 'center', shadowColor: "#2B74E4", shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4}, shadowRadius: 8, elevation: 4 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 17 }
});