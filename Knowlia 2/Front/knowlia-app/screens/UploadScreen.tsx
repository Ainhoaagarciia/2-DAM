import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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

export default function UploadScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urlVideo, setUrlVideo] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/categoria`)
      .then(res => res.json())
      .then(data => setCategorias(data)); 
  }, []);

  const puedeSubir = titulo && descripcion && urlVideo && precio !== '' && categoria;

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    return "";
  };

  const handleUpload = async () => {
    if (!puedeSubir) return;
    setLoading(true);
    const thumbnailGenerado = getYoutubeThumbnail(urlVideo);

    const body = {
      titulo,
      descripcion,
      url_video: urlVideo,
      autor_id: user.id,
      precio: precio === '' ? 0 : parseFloat(precio), 
      clave_thumbnail: thumbnailGenerado || "thumbnail_placeholder",
      categoria_id: categoria.id 
    };

    try {
      const res = await fetch(`${API}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        Alert.alert("¡Vídeo subido!", "Tu vídeo ya está disponible en tu perfil.");
        navigation.goBack(); 
      } else {
        Alert.alert("Error", "No se pudo subir el vídeo. Asegúrate de ser profesor.");
      }
    } catch (e) {
      Alert.alert("Error de red", "Revisa tu conexión e inténtalo otra vez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fc" }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 50, paddingBottom: 100 }}>
          
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>NUEVO VÍDEO</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.bannerCard}>
            <View style={styles.iconBadge}>
              <Feather name="upload-cloud" size={28} color="#2B74E4" />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.bannerTitle}>Sube tu contenido</Text>
                <Text style={styles.bannerSubtitle}>Comparte tu conocimiento con la comunidad</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            
            <Text style={styles.label}>Título</Text>
            <View style={styles.inputWrapper}>
              <Feather name="type" size={20} color="#2B74E4" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={titulo} 
                onChangeText={setTitulo} 
                placeholder="Título del curso" 
                placeholderTextColor="#cbd5e1" 
              />
            </View>

            <Text style={styles.label}>Descripción</Text>
            <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
              <Feather name="file-text" size={20} color="#2B74E4" style={[styles.inputIcon, { marginTop: 2 }]} />
              <TextInput 
                style={[styles.input, { height: '100%', textAlignVertical: 'top' }]} 
                value={descripcion} 
                onChangeText={setDescripcion} 
                placeholder="¿De qué trata este video?" 
                placeholderTextColor="#cbd5e1" 
                multiline 
              />
            </View>

            <Text style={styles.label}>Enlace de YouTube</Text>
            <View style={styles.inputWrapper}>
              <Feather name="link" size={20} color="#2B74E4" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={urlVideo} 
                onChangeText={setUrlVideo} 
                placeholder="https://youtube.com/..." 
                placeholderTextColor="#cbd5e1" 
                autoCapitalize="none" 
                keyboardType="url" 
              />
            </View>

            <Text style={styles.label}>Precio (€)</Text>
            <View style={styles.inputWrapper}>
              <Feather name="dollar-sign" size={20} color="#2B74E4" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                value={precio} 
                onChangeText={setPrecio} 
                placeholder="0 para gratis" 
                placeholderTextColor="#cbd5e1" 
                keyboardType="numeric" 
              />
            </View>

            <Text style={styles.label}>Categoría</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowCatModal(true)}
              activeOpacity={0.7}
            >
              <Feather name="grid" size={20} color="#2B74E4" style={styles.inputIcon} />
              <Text style={{ flex: 1, color: categoria ? "#334155" : "#cbd5e1", fontSize: 16 }}>
                {categoria?.nombre || "Selecciona una categoría"}
              </Text>
              <Feather name="chevron-down" size={20} color="#2B74E4" />
            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={[
              styles.btnSubir,
              { opacity: puedeSubir && !loading ? 1 : 0.6 }
            ]}
            onPress={handleUpload}
            disabled={!puedeSubir || loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <Feather name="upload" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.btnSubirText}>Publicar Video</Text>
                </>
              )
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showCatModal} animationType="slide" transparent>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setShowCatModal(false)}>
          <View style={styles.modalDropdown}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Elige una categoría</Text>
                <View style={{width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 10}}/>
            </View>
            <FlatList
              data={categorias}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => { setCategoria(item); setShowCatModal(false); }}
                >
                  <Feather name="hash" size={18} color="#2B74E4" style={{marginRight: 10}} />
                  <Text style={styles.modalItemText}>{item.nombre}</Text>
                  {categoria?.id === item.id && <Feather name="check" size={18} color="#2B74E4" style={{marginLeft: 'auto'}} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  headerTitle: { color: "#232323", fontSize: 23, fontWeight: "900", letterSpacing: 1, textShadowColor: "#aac6ffff", textShadowOffset: { width: 0, height: 1.8 }, textShadowRadius: 5, marginRight: 5, alignSelf: "center" },

  bannerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eaf2ff', borderRadius: 20, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#dbeafe' },
  iconBadge: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  bannerTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 2 },
  bannerSubtitle: { fontSize: 13, color: "#64748b", lineHeight: 18 },

  formCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, marginBottom: 25 },
  
  label: { fontSize: 14, fontWeight: "700", color: "#1e293b", marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 14, paddingHorizontal: 15, height: 54, marginBottom: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "#334155", fontSize: 16, height: '100%' },

  btnSubir: { backgroundColor: "#2B74E4", flexDirection: "row", padding: 16, borderRadius: 16, alignItems: "center", justifyContent: "center", shadowColor: "#2B74E4", shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4}, shadowRadius: 8, elevation: 4 },
  btnSubirText: { color: "#fff", fontWeight: "bold", fontSize: 17 },

  modalDropdown: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '50%', elevation: 20, paddingBottom: 30 },
  modalHeader: { padding: 20, paddingBottom: 10, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalItemText: { fontSize: 16, color: '#334155', fontWeight: '500' }
});