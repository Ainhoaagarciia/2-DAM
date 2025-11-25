import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFavoritos } from "./FavoritosProvider";

const API = 'http://10.0.2.2:3000';
const USUARIO_ID = 2;
const CARD_WIDTH = (Dimensions.get("window").width - 48) / 2;

export default function PerfilScreen() {
  const navigation = useNavigation() as any;
  const [usuario, setUsuario] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoritos, toggleFavorito, fetchFavoritos } = useFavoritos() as any;

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetch(`${API}/usuario/${USUARIO_ID}`).then(res => res.json()).then(setUsuario);

      fetch(`${API}/video?autor_id=${USUARIO_ID}&order=DESC`)
        .then(res => res.json())
        .then(data => {
             // Si el backend devuelve { total, videos }, extraemos videos.
             const listaVideos = data.videos ?? data; 
             setVideos(listaVideos); 
        })
        .catch(err => console.error("Error fetching videos", err))
        .finally(() => setLoading(false));

      fetchFavoritos();
    }, [])
  );

  if (!usuario) {
    return <ActivityIndicator style={{ marginTop: 50 }} color="#2B74E4" />;
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-evenly" }}
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
      ListHeaderComponent={
        <>
          <View style={styles.cardPerfil}>
            {/* Header con margen arriba, flecha izq, PERFIL centrado, ajustes derecha */}
            <View style={styles.headerBackRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
                <Feather name="arrow-left" size={23} color="#232323" />
              </TouchableOpacity>
              <Text style={styles.tituloDecorado}>PERFIL</Text>
              <TouchableOpacity onPress={() => alert("Ajustes")} style={styles.headerIconBtn}>
                <Feather name="settings" size={23} color="#2B74E4" />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", marginTop: 10, marginBottom: 14 }}>
              <View style={styles.avatarCircle}>
                <Image
                  source={usuario?.avatar_url ? { uri: usuario.avatar_url } : { uri: "https://randomuser.me/api/portraits/lego/2.jpg" }}
                  style={styles.avatarBig}
                />
              </View>
              <Text style={styles.nombre}>{usuario?.nombre || "---"}</Text>
              <Text style={styles.emailUser}>{usuario?.correo}</Text>
            </View>
            <View style={styles.statsRowBig}>
              <View style={styles.statBox}>
                <Feather name="users" size={20} color="#2B74E4" />
                <Text style={styles.statVal}>30k</Text>
                <Text style={styles.statLabel}>Visitas</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="user-plus" size={20} color="#2B74E4" />
                <Text style={styles.statVal}>120</Text>
                <Text style={styles.statLabel}>Contactos</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="film" size={20} color="#2B74E4" />
                <Text style={styles.statVal}>{videos.length}</Text>
                <Text style={styles.statLabel}>Videos subidos</Text>
              </View>
              <View style={styles.statBox}>
                <Feather name="star" size={20} color="#2B74E4" />
                <Text style={styles.statVal}>4.8</Text>
                <Text style={styles.statLabel}>Valoración</Text>
              </View>
            </View>
            {/* Fila dos botones alargados */}
            <View style={styles.actionRowAlargada}>
              <TouchableOpacity style={styles.actionBtnAlargado} onPress={() => alert("Editar perfil")}>
                <Feather name="edit" size={20} color="#2B74E4" style={{ marginRight: 7 }} />
                <Text style={styles.actionTextAlargado}>Editar perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnAlargado} onPress={() => alert("Cerrar sesión")}>
                <Feather name="log-out" size={20} color="#2B74E4" style={{ marginRight: 7 }} />
                <Text style={styles.actionTextAlargado}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.videosSubidosTitle}>Videos Subidos</Text>
          {loading &&
            <ActivityIndicator style={{ marginVertical: 40 }} color="#2B74E4" />
          }
        </>
      }
      renderItem={({ item }) => {
        const isFav = (favoritos ?? []).includes(item.id);
        return (
          <TouchableOpacity
            style={styles.cardVideo}
            onPress={() => navigation.navigate("VideoDetailsScreen", { videoId: item.id })}
            activeOpacity={0.93}
          >
            <View style={styles.miniaturaVideo}>
              {item.clave_thumbnail
              ? (
                <Image 
                  source={{ 
                    uri: item.clave_thumbnail.startsWith('http') 
                      ? item.clave_thumbnail  // Si empieza por http, es de YouTube, úsala directa
                      : `https://knowlia.s3.us-east-1.amazonaws.com/${item.clave_thumbnail}` // Si no, es de S3, ponle el prefijo
                  }} 
                  style={{ width: "100%", height: "100%", borderRadius: 12 }} 
                  resizeMode="cover" 
                />
              )
              : <Feather name="film" size={32} color="#8c99af" style={{ alignSelf: "center", marginTop: 14 }} />
            }
            </View>
            <Text style={styles.tituloCardVideo} numberOfLines={2}>{item.titulo}</Text>
            <Text style={styles.txtNivel}>
              {item.videoCategorias?.[0]?.categoria?.nombre || item.videoCategorias?.[0]?.nombre || "Sin categoría"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
              <Feather name="star" size={15} color="#ffc534" />
              <Text style={styles.valorCard}>{parseFloat(item.valoracion ?? "4.7").toFixed(1)} <Text style={{ color: "#b2bac6" }}>({item.numero_valoraciones ?? 0})</Text></Text>
            </View>
            <TouchableOpacity
              style={styles.iconoFavorito}
              onPress={() => toggleFavorito(item.id)}
              hitSlop={12}
            >
              <Feather
                name="bookmark"
                size={26}
                color={isFav ? "#2B74E4" : "#bbb"}
                style={{
                  backgroundColor: isFav ? "#eaf0fa" : 'transparent',
                  borderRadius: 10,
                  padding: 2
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={() => !loading && (
        <Text style={{ color: "#888", textAlign: "center", marginTop: 32 }}>No has subido vídeos aún.</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardPerfil: {
    marginHorizontal: -5,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 34,  // <-- Más margen arriba
    paddingBottom: 13,
    elevation: 8,
    marginBottom: 25,
    shadowColor: "#117ceeff",
    shadowOpacity: 0.18,
    shadowRadius: 7
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#69a4f8",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddefff",
    shadowColor: "#bbd8f6",
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
    marginBottom: 8,
  },
  avatarBig: {
    width: 76,
    height: 76,
    borderRadius: 47,
    backgroundColor: "#dde4ef",
  },
  nombre: { fontWeight: "bold", fontSize: 19, color: "#222", marginTop: 4 },
  emailUser: { fontSize: 13, color: "#5a87b9ff", marginBottom: 2 },
  statsRowBig: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 2, marginVertical: 14 },
  statBox: { alignItems: "center", minWidth: 90 },
  statVal: { fontWeight: "900", color: "#000000ff", fontSize: 15, marginTop: 2, marginBottom: 0 },
  statLabel: { color: "#7b899b", fontSize: 13,  textAlign: "center" },
  videosSubidosTitle: { color: "#2B74E4", fontSize: 19, fontWeight: "900", letterSpacing: 1, flex: 1, textShadowColor: "#aac6ffff", textShadowOffset: { width: 0, height: 1.8 }, textShadowRadius: 5, marginLeft: 25, marginBottom: 12  },
  cardVideo: {
    backgroundColor: "#fff",
    width: CARD_WIDTH, minHeight: 152,
    borderRadius: 17,
    marginBottom: 17,
    padding: 12,
    shadowColor: "#2B74E4", shadowOpacity: 0.16, elevation: 3
  },
  miniaturaVideo: {
    width: "100%",
    height: 90,
    borderRadius: 12,
    backgroundColor: "#eaf0fa",
    marginBottom: 7,
    justifyContent: "center", alignItems: "center"
  },
  tituloCardVideo: { fontWeight: "bold", fontSize: 14.5, color: "#22313f", marginBottom: 2, flexShrink: 1 },
  txtNivel: { color: "#8aa1c7", fontSize: 13, marginBottom: 1, fontWeight: "bold" },
  valorCard: { color: "#516699", fontWeight: "bold", fontSize: 13, marginLeft: 3 },
  iconoFavorito: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
    borderRadius: 12,
    overflow: "hidden"
  },
  headerBackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,   // <-- margen encima del header
    marginBottom: 12,
    marginHorizontal: 8
  },
  tituloDecorado: {
    color: "#232323",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 1,
    textShadowColor: "#aac6ffff",
    textShadowOffset: { width: 0, height: 1.8 },
    textShadowRadius: 5,
    alignSelf: "center"
  },
  headerIconBtn: {
    backgroundColor: "#ececec",
    borderRadius: 30,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  actionRowAlargada: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 2,
    marginBottom: 9,
    marginHorizontal: 6,
  },
  actionBtnAlargado: {
    backgroundColor: "#eaf0fa",
    flex: 1,
    marginHorizontal: 7,
    borderRadius: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  actionTextAlargado: {
    fontSize: 15,
    color: "#2B74E4",
    fontWeight: "700",
    textAlign: "center"
  },
});
