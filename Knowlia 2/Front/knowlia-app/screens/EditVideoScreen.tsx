import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function EditVideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoId } = (route.params as any) || {};
  const { user } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 

  // Cargar datos iniciales
  useEffect(() => {
    fetch(`${API}/video/${videoId}`)
      .then(res => res.json())
      .then(data => {
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setPrecio(data.precio ? data.precio.toString() : '0');
        setThumbnail(data.clave_thumbnail);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "No se pudo cargar el video");
        navigation.goBack();
      });
  }, [videoId]);

  const handleUpdate = async () => {
    setSaving(true);
    
    const body = {
      titulo,
      descripcion,
      precio: parseFloat(precio),
      clave_thumbnail: thumbnail,
      autor_id: user.id 
    };

    try {
      const res = await fetch(`${API}/video/${videoId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        Alert.alert("¡Actualizado!", "El video se ha modificado correctamente.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "No se pudo actualizar el video.");
      }
    } catch (error) {
      Alert.alert("Error", "Fallo de conexión.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.centerLoading}><ActivityIndicator size="large" color="#2B74E4"/></View>;

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 22, paddingBottom: 100, paddingTop: 40 }}
            >
            
                <View style={styles.headerBackRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={23} color="#232323" />
                    </TouchableOpacity>
                    <Text style={styles.tituloDecorado}>EDITAR VIDEO</Text>
                    <View style={{ width: 20 }} /> 
                </View>

                <View style={styles.card}>
                    <View style={styles.iconBox}>
                        <Feather name="edit-3" size={38} color="#438aff" />
                    </View>
                    <Text style={styles.tituloCard}>Modificar detalles</Text>
                    <Text style={styles.subCard}>
                        Actualiza la información de tu vídeo
                    </Text>
                </View>
                
                <View style={styles.inputRow}>
                    <Feather name="type" size={20} color="#2B74E4" style={{ marginRight: 12 }} />
                    <TextInput 
                        style={styles.input} 
                        value={titulo} 
                        onChangeText={setTitulo} 
                        placeholder="Título del video"
                        placeholderTextColor="#bbb"
                    />
                </View>

                <View style={styles.inputRow}>
                    <Feather name="file-text" size={20} color="#2B74E4" style={{ marginRight: 12 }} />
                    <TextInput 
                        style={[styles.input, { height: 90, textAlignVertical: 'top' }]} 
                        value={descripcion} 
                        onChangeText={setDescripcion} 
                        multiline 
                        placeholder="Descripción del contenido..."
                        placeholderTextColor="#bbb"
                    />
                </View>

                <View style={styles.inputRow}>
                    <Feather name="dollar-sign" size={20} color="#2B74E4" style={{ marginRight: 12 }} />
                    <TextInput 
                        style={styles.input} 
                        value={precio} 
                        onChangeText={setPrecio} 
                        keyboardType="numeric" 
                        placeholder="Precio (0 para gratis)"
                        placeholderTextColor="#bbb"
                    />
                </View>

                <View style={styles.inputRow}>
                    <Feather name="image" size={20} color="#2B74E4" style={{ marginRight: 12 }} />
                    <TextInput 
                        style={styles.input} 
                        value={thumbnail} 
                        onChangeText={setThumbnail} 
                        placeholder="URL de la imagen de portada"
                        placeholderTextColor="#bbb"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.btnAction, { opacity: saving ? 0.7 : 1 }]} 
                    onPress={handleUpdate}
                    disabled={saving}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Feather name="check" size={20} color="#fff" style={{marginRight: 8}} />
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
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  headerBackRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, marginBottom: 15 },
  backBtn: { backgroundColor: "#ececec", borderRadius: 30, width: 38, height: 38, alignItems: "center", justifyContent: "center", marginBottom: 5 },
  tituloDecorado: { color: "#232323", 
    fontSize: 23, 
    fontWeight: "900", 
    letterSpacing: 1, 
    textShadowColor: "#aac6ffff", 
    textShadowOffset: { width: 0, height: 1.8 }, 
    textShadowRadius: 5  },

  card: { alignItems: "center", backgroundColor: "#fff", borderRadius: 18, paddingVertical: 26, marginBottom: 30, shadowColor: "#156fff", shadowOpacity: 0.14, elevation: 6 },
  iconBox: { width: 65, height: 65, borderRadius: 32, backgroundColor: "#eeeffb", alignItems: "center", justifyContent: "center", marginBottom: 7, shadowOpacity: 0.13, shadowRadius: 7 },
  tituloCard: { fontWeight: "900", fontSize: 18, marginBottom: 3, color: "#253b5e", marginTop: -6 },
  subCard: { color: "#98a5be", fontSize: 13, marginBottom: 5, marginTop: 2, fontWeight: "500" },

  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  input: { backgroundColor: "#fff", color: "#232323", fontSize: 14.5, borderRadius: 13, padding: 13, marginBottom: 10, borderColor: "#e1eaff", borderWidth: 1.2, flex: 1 },

  btnAction: { backgroundColor: "#2B74E4", borderRadius: 13, paddingVertical: 13, alignItems: "center", marginTop: 18, marginBottom: 18, flexDirection: "row", justifyContent: "center", shadowColor: "#2B74E4", shadowOpacity: 0.12, shadowRadius: 5, elevation: 5 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 17 }
});