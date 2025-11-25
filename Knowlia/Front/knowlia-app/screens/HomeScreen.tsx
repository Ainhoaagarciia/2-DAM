import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavoritos } from './FavoritosProvider';
const SCREEN_WIDTH = Dimensions.get('window').width;

const API = 'http://10.0.2.2:3000';

function PortadaVideo({ thumbnail, onPress, style, iconSize = 40 }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.93} style={[{ position: "relative", overflow: "hidden" }, style]}>
      {thumbnail ? (
        <Image
          source={{ 
            uri: thumbnail.startsWith('http') 
              ? thumbnail 
              : `https://knowlia.s3.us-east-1.amazonaws.com/${thumbnail}` 
          }}
          style={[
            StyleSheet.absoluteFill,
            { width: undefined, height: undefined, borderRadius: style?.borderRadius || 0 }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View style={[style, { backgroundColor: "#eaf0fa", alignItems: "center", justifyContent: "center" }]}>
          <Feather name="film" size={iconSize} color="#8c99af" />
        </View>
      )}
      {/* ... el resto del componente (icono play) sigue igual ... */}
      <Feather name="play-circle" size={iconSize} color="#fff" style={{ position: 'absolute', top: "50%", left: "50%", marginLeft: -iconSize / 2, marginTop: -iconSize / 2, zIndex: 1, opacity: 0.91 }} />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation() as any;
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [videoDestacado, setVideoDestacado] = useState<any>(null);
  const { favoritos, toggleFavorito, fetchFavoritos } = useFavoritos() as any;
  const [loading, setLoading] = useState(true);
  const USUARIO_ID = 2;

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoritos();
    }, [])
  );

  useEffect(() => {
    fetch(`${API}/video?sort=valoracion&order=DESC&limit=40`)
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos ?? []);
        const destacado = (data.videos ?? []).find((v: any) => v.id === 2) || (data.videos ?? [])[0];
        setVideoDestacado(destacado);
        setLoading(false);
      });

    fetch(`${API}/usuario`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((u: any) => u.id === 2);
        setUser(found || { nombre: 'Sin usuario', avatar_url: '' });
      });

    fetchFavoritos();
  }, []);

  if (loading || !user || !videoDestacado)
    return <ActivityIndicator size="large" color="#2B74E4" style={{ marginTop: 90 }} />;

  const videosFiltrados = videos.filter(v => v.id !== 2);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f8ff" }}>
      {/* CABECERA FIJA ARRIBA */}
      <View style={{ paddingTop: 40, backgroundColor: "#f5f8ff" }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.holaGrande}>
              ¡Hola, <Text style={styles.nombreAzul}>{user.nombre || "Usuario"}</Text> !
            </Text>
            <Text style={styles.subGreeting}>¡Aprende algo nuevo hoy!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")} activeOpacity={0.8}>
            <View style={styles.avatarCircle}>
              {user.avatar_url
                ? <Image source={{ uri: user.avatar_url }} style={styles.avatarCabecera} />
                : (
                  <View style={[styles.avatarCabecera, { alignItems: "center", justifyContent: "center" }]}>
                    <Feather name="user" size={23} color="#aaa" />
                  </View>
                )
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >{/* VIDEO DESTACADO */}
      <View style={styles.cardMid}>
        <View style={styles.badgeTrending}>
          <Text style={styles.trendingText}>Trending!</Text>
        </View>
        <PortadaVideo
          thumbnail={videoDestacado.clave_thumbnail}
          style={styles.portadaBig}
          iconSize={54}
          onPress={() => navigation.navigate('VideoDetailsScreen', { videoId: videoDestacado.id })}
        />
        <View style={{ paddingHorizontal: 15, paddingVertical: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 5 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.tituloMid} numberOfLines={1}>{videoDestacado.titulo}</Text>
                <TouchableOpacity
                  style={{ padding: 3, borderRadius: 13, marginLeft: 7 }}
                  onPress={() => toggleFavorito(videoDestacado.id)}
                  hitSlop={10}
                >
                  <Feather
                    name="bookmark"
                    size={22}
                    color={favoritos.includes(videoDestacado.id) ? "#2B74E4" : "#bbb"}
                    fill={favoritos.includes(videoDestacado.id) ? "#2B74E4" : "none"}
                    style={{
                      backgroundColor: favoritos.includes(videoDestacado.id) ? "#eaf0fa" : "transparent",
                      borderRadius: 8
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{
                color: "#2B74E4", fontWeight: "bold", fontSize: 15, marginTop: 4, marginBottom: 0, textAlign: "left"
              }}>
                {Array.isArray(videoDestacado.videoCategorias) && videoDestacado.videoCategorias.length > 0
                  ? (videoDestacado.videoCategorias[0]?.categoria?.nombre || videoDestacado.videoCategorias[0]?.nombre || "Sin categoría")
                  : "Sin categoría"}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 9, marginTop: 6 }}>
              <Image
                source={videoDestacado.autor?.avatar_url ? { uri: videoDestacado.autor.avatar_url } : undefined}
                style={{ width: 23, height: 23, borderRadius: 12, backgroundColor: "#eee" }}
              />
              <Text style={styles.autorMini}>{videoDestacado.autor?.nombre ?? "---"}</Text>
            </View>
          </View>
          <View style={styles.midRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.estrellasMid}>
                {parseFloat(videoDestacado.valoracion ?? '4.7').toFixed(1)}/5
              </Text>
              <Feather name="star" size={17} color="#ffc534" style={{ marginLeft: 5, marginRight: 2 }} />
              <Text style={styles.countValoraciones}>({videoDestacado.numero_valoraciones ?? 0})</Text>
            </View>
            <Text style={styles.precioPill}>
              {videoDestacado.precio && videoDestacado.precio !== "0"
                ? `${videoDestacado.precio} €`
                : "Gratis"}
            </Text>
          </View>
        </View>
      </View>
      {/* MÁS POPULARES LISTA */}
        <View style={{ marginHorizontal: 22, marginTop: 18, marginBottom: 8, flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "#2B74E4", fontSize: 19, fontWeight: "900", letterSpacing: 1, flex: 1, textShadowColor: "#aac6ffff", textShadowOffset: { width: 0, height: 1.8 }, textShadowRadius: 5, marginBottom: 12 }}>Más Populares</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Videos")}>
            <Feather name="menu" size={21} color="#2B74E4" />
          </TouchableOpacity>
        </View>

        {videosFiltrados.slice(0, 4).map((item: any) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.92}
            onPress={() => navigation.navigate('VideoDetailsScreen', { videoId: item.id })}
            style={styles.cursoPopularCardRow}
          >
            <PortadaVideo
              thumbnail={item.clave_thumbnail}
              style={styles.cursoPopularThumb}
              iconSize={32}
              onPress={() => navigation.navigate('VideoDetailsScreen', { videoId: item.id })}
            />
            <View style={{ flex: 1, marginLeft: 13, justifyContent: "center" }}>
              <Text style={styles.cursoPopularTitulo} numberOfLines={1}>{item.titulo}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Image
                  source={item.autor?.avatar_url ? { uri: item.autor.avatar_url } : undefined}
                  style={{ width: 17, height: 17, borderRadius: 8.5, marginRight: 4, backgroundColor: "#eee" }}
                />
                <Text style={{ color: "#7a859e", fontSize: 12, marginRight: 6 }}>{item.autor?.nombre ?? "---"}</Text>
                <Text style={styles.estrellasMini}>
                  {parseFloat(item.valoracion ?? '4.7').toFixed(1)} <Feather name="star" size={13} color="#ffc534" />
                </Text>
                <Text style={styles.cursoPopularCategoria}>
                  {item.videoCategorias?.[0]?.categoria?.nombre || item.videoCategorias?.[0]?.nombre || '---'}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>
              <Text style={styles.cursoPopularPrecio}>
                {item.precio && item.precio !== "0" ? `${item.precio} €` : "Gratis"}
              </Text>
              <TouchableOpacity
                style={{ padding: 5, marginTop: 4 }}
                onPress={() => toggleFavorito(item.id)}
                hitSlop={12}>
                <Feather
                  name="bookmark"
                  size={20}
                  color={favoritos.includes(item.id) ? "#2B74E4" : "#bbb"}
                  fill={favoritos.includes(item.id) ? "#2B74E4" : "none"}
                  style={{
                    backgroundColor: favoritos.includes(item.id) ? "#eaf0fa" : "transparent",
                    borderRadius: 7
                  }}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 16, marginHorizontal: 19 },
  holaGrande: { fontWeight: "900", fontSize: 26, color: "#232323", marginBottom: 1, textShadowColor: "#aac6ffff", textShadowOffset: { width: 0, height: 1.6 }, textShadowRadius: 5 },
  nombreAzul: { color: "#2B74E4", fontWeight: "900", fontSize: 26 },
  subGreeting: { color: "#6ea1f8ff", fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 3, borderColor: "#69a4f8",
    justifyContent: "center", alignItems: "center", backgroundColor: "#ddefff",
    shadowColor: "#bbd8f6", shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
  },
  avatarCabecera: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#eee"  },
  badgeTrending: {
    position: "absolute",
    top: 13,
    left: 15,
    backgroundColor: "#2B74E4",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    zIndex: 10,
    borderColor: "#06359bff",
    borderWidth: 1.5
  },
  trendingText: {
    color: "#fff", fontWeight: "bold", fontSize: 13, letterSpacing: .5
  },
  cardMid: {
    marginHorizontal: 22,
    borderRadius: 19,
    marginBottom: 10, marginTop: 2,
    alignItems: 'center',
    overflow: "hidden",
    position: "relative"
  },
  portadaBig: {
    width: SCREEN_WIDTH - 44,
    height: 200,
    borderRadius: 19,
    backgroundColor: "#f2f2f2",
    borderColor: "#06359bff",
    borderWidth: 1.3
  },
  tituloMid: { fontWeight: "900", fontSize: 20, color: "#232323", maxWidth: "68%" },
  autorMini: { fontSize: 14, color: "#7a859e", marginLeft: 6 },
  midRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 4
  },
  estrellasMid: {
    color: "#232323", fontWeight: "bold", fontSize: 16,
  },
  countValoraciones: { color: "#8a929b", fontWeight: "bold", fontSize: 15, marginLeft: 4 },
  precioPill: {
    backgroundColor: "#2B74E4", color: "#fff", fontWeight: "bold", fontSize: 16, borderRadius: 22,
    paddingVertical: 3, paddingHorizontal: 18, minWidth: 76, textAlign: "center", marginLeft: 12
  },
  cursoPopularCardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 18,
    marginBottom: 11,
    padding: 12,
    elevation: 2,
    shadowColor: '#134cc7ff',
    shadowOpacity: 0.005,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 3 }
  },
  cursoPopularThumb: {
    width: 48,
    height: 48,
    borderRadius: 11,
    backgroundColor: "#f0f4fa",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cursoPopularTitulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 1,
    color: "#222"
  },
  cursoPopularCategoria: {
    color: "#2B74E4",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.93
  },
  cursoPopularPrecio: {
    backgroundColor: "#2B74E4",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 1,
    textAlign: "right"
  },
  estrellasMini: {
    color: "#232323",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 2,
    marginRight: 2
  }
});
