import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API = 'http://10.0.2.2:3000';
const USUARIO_ID = 2;

export default function UploadScreen() {
  const navigation = useNavigation();
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
      .then(data => setCategorias(data)); // debe devolver [{id, nombre}]
  }, []);

  const puedeSubir = titulo && descripcion && urlVideo && precio !== '' && categoria;

  const handleUpload = async () => {
    if (!puedeSubir) return;
    setLoading(true);
    const thumbnailGenerado = getYoutubeThumbnail(urlVideo);
    const body = {
      titulo,
      descripcion,
      url_video: urlVideo,
      autor_id: USUARIO_ID,
      precio: precio === '' ? 0 : parseFloat(precio), // Asegúrate de mandar número
      clave_thumbnail: thumbnailGenerado || "thumbnail_placeholder",
      categoria_id: categoria.id // <--- Enviamos directamente el ID plano
    };

    try {
      const res = await fetch(`${API}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        Alert.alert("¡Vídeo subido!", "Tu vídeo ya está disponible en tu perfil.");
        navigation.goBack(); // Así volverá y ProfileScreen podrá listar el video recién creado si consulta por autor
      } else {
        Alert.alert("Error", "No se pudo subir el vídeo. Intenta de nuevo.");
      }
    } catch (e) {
      Alert.alert("Error de red", "Revisa tu conexión e inténtalo otra vez.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la miniatura de YouTube
const getYoutubeThumbnail = (url: string) => {
  if (!url) return "";
  // Expresión regular para sacar el ID (funciona con youtube.com y youtu.be)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    const videoId = match[2];
    // Devuelve la miniatura de alta calidad
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return ""; // Si falla, devolvemos vacío
};

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f6fa", paddingTop: 40 }}
      contentContainerStyle={{ padding: 22, paddingBottom: 100 }}
    >
      {/* Header con flecha atrás */}
      <View style={[styles.headerBackRow, { marginTop: 8, marginBottom: 5 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={23} color="#232323" />
        </TouchableOpacity>
        <Text style={styles.tituloDecorado}></Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Card motivadora arriba */}
      <View style={[styles.card, { marginTop: 7, marginBottom: 30, elevation: 6 }]}>
        <Text style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#6ea1f8ff",
          marginBottom: 9
        }}>
          Comparte tu conocimiento aquí
        </Text>
        <View style={[styles.uploadIconBox, { shadowOpacity: 0.13, shadowRadius: 7 }]}>
          <Feather name="upload-cloud" size={38} color="#438aff" />
        </View>
        <Text style={[styles.tituloGrande, { marginBottom: 2, marginTop: -6 }]}>Sube tu video</Text>
        <Text style={{ color: "#98a5be", fontSize: 13, marginBottom: 5, marginTop: 2, fontWeight: "500" }}>
          Introduce la URL y los datos de tu video
        </Text>
      </View>

      {/* Campos con iconos */}
      <View style={styles.inputRow}>
        <Feather name="edit" size={17} color="#2B74E4" style={{ marginRight: 12 }} />
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ingresa el título" placeholderTextColor="#bbb" />
      </View>
      <View style={styles.inputRow}>
        <Feather name="file-text" size={17} color="#2B74E4" style={{ marginRight: 12 }} />
        <TextInput style={[styles.input, { height: 90, textAlignVertical: "top" }]} value={descripcion} onChangeText={setDescripcion} placeholder="Ingresa la descripción" placeholderTextColor="#bbb" multiline />
      </View>
      <View style={styles.inputRow}>
        <Feather name="link" size={17} color="#2B74E4" style={{ marginRight: 12 }} />
        <TextInput style={styles.input} value={urlVideo} onChangeText={setUrlVideo} placeholder="Inserta la URL del video de YouTube" placeholderTextColor="#bbb" autoCapitalize="none" keyboardType="url" />
      </View>
      <View style={styles.inputRow}>
        <Feather name="dollar-sign" size={17} color="#2B74E4" style={{ marginRight: 12 }} />
        <TextInput style={styles.input} value={precio} onChangeText={setPrecio} placeholder="Ejemplo: 5 o 0 (gratis)" placeholderTextColor="#bbb" keyboardType="numeric" />
      </View>

      <Text style={styles.label}>Selección de Categoría</Text>
      <TouchableOpacity
        style={[styles.input, { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }]}
        onPress={() => setShowCatModal(true)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="list" size={17} color="#2B74E4" style={{ marginRight: 12 }} />
          <Text style={{ color: categoria ? "#232323" : "#bbb", fontSize: 15 }}>
            {categoria?.nombre || "Selecciona una categoría"}
          </Text>
        </View>
        <Feather name="chevron-down" size={22} color="#aaa" />
      </TouchableOpacity>

      {/* Modal Dropdown categorías */}
      <Modal visible={showCatModal} animationType="slide" transparent>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "#0006" }} onPress={() => setShowCatModal(false)}>
          <View style={styles.modalDropdown}>
            <FlatList
              data={categorias}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 16 }}
                  onPress={() => { setCategoria(item); setShowCatModal(false); }}
                >
                  <Text style={{ color: "#253b5e", fontWeight: "bold", fontSize: 16 }}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => <Text style={{ padding: 18, color: "#999" }}>Cargando...</Text>}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Botón subir visualmente destacado */}
      <TouchableOpacity
        style={[
          styles.btnSubir,
          {
            opacity: puedeSubir && !loading ? 1 : 0.5,
            flexDirection: "row",
            justifyContent: "center",
            shadowColor: "#2B74E4",
            shadowOpacity: 0.12,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            elevation: 5,
          }
        ]}
        onPress={handleUpload}
        disabled={!puedeSubir || loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : (
            <>
              <Feather name="upload" size={20} color="#fff" style={{ marginRight: 7 }} />
              <Text style={styles.btnSubirText}>Subir video</Text>
            </>
          )
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 18, 
    paddingVertical: 26, 
    shadowColor: "#156fff", 
    shadowOpacity: 0.14, 
    elevation: 6, 
  },
  uploadIconBox: { 
    width: 65, 
    height: 65, 
    borderRadius: 32, 
    backgroundColor: "#eeeffb", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 7 
  },
  tituloGrande: { fontWeight: "900", fontSize: 18, marginBottom: 3, color: "#253b5e" },
  label: { fontWeight: "bold", color: "#092153", fontSize: 15, marginBottom: 7, marginTop: 12, marginLeft: 2 },
  input: { backgroundColor: "#fff", color: "#232323", fontSize: 15, borderRadius: 13, padding: 13, marginBottom: 10, borderColor: "#e1eaff", borderWidth: 1.2, flex: 1 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  btnSubir: { 
    backgroundColor: "#2B74E4", 
    borderRadius: 13, 
    paddingVertical: 13, 
    alignItems: "center", 
    marginTop: 18, 
    marginBottom: 18 
  },
  btnSubirText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
  modalDropdown: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: 340,
    elevation: 10,
  },
  headerBackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 12,
    marginHorizontal: 8
  },
  backBtn: {
    backgroundColor: "#ececec",
    borderRadius: 30,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  tituloDecorado: {
    color: "#2B74E4",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "#aac6ffff",
    textShadowOffset: { width: 0, height: 1.8 },
    textShadowRadius: 5,
    marginRight: 5, alignSelf: "center"
  },
});
