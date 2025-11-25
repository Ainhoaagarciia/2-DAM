import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useFavoritos } from './FavoritosProvider';

const API = 'http://10.0.2.2:3000';

function extractYouTubeId(url: string | null) {
  if (!url) return null;
  const regExp = /(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function VideoDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoId } = (route.params as any) || {};
  const [video, setVideo] = useState<any>(null);
  const { favoritos, toggleFavorito, fetchFavoritos } = useFavoritos() as any;
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState<any[]>([]);

  useEffect(() => { fetchFavoritos(); }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/video/${videoId}`)
      .then(res => res.json())
      .then(data => {
        setVideo(data);
        setLoading(false);
      });

    setTimeout(() => {
      setComentarios([
        {
          id: 1,
          texto: "¡Muy buen curso, muy claro! Me encantó la manera en la que explica los conceptos. Volveré a ver más vídeos del canal.",
          fecha: "hace 2 días",
          usuario: {
            nombre: "Marina",
            avatar_url: "https://randomuser.me/api/portraits/women/1.jpg"
          }
        },
        {
          id: 2,
          texto: "Me ha quedado clarísimo cómo funciona! La explicación es clara y sencilla. Súper recomendable. ¡Gracias por el esfuerzo!",
          fecha: "hace 1 día",
          usuario: {
            nombre: "Jose",
            avatar_url: "https://randomuser.me/api/portraits/men/1.jpg"
          }
        },
        {
          id: 3,
          texto: "¡Genial! La calidad del audio y vídeo es de 10 y el profesor responde rápido a las dudas.",
          fecha: "hace 4 horas",
          usuario: {
            nombre: "Andrea",
            avatar_url: "https://randomuser.me/api/portraits/women/60.jpg"
          }
        }
      ]);
    }, 400);
  }, [videoId]);

  if (!video || loading)
    return <ActivityIndicator size="large" color="#2B74E4" style={{ marginTop: 90 }} />;

  const catTexto = video.videoCategorias && video.videoCategorias.length > 0
    ? video.videoCategorias[0]?.categoria?.nombre
    : "Sin categoría";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f6f6fa", paddingTop: 40 }} contentContainerStyle={{ paddingBottom: 48 }}>
      <View style={styles.headerBackRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={23} color="#232323" />
        </TouchableOpacity>
        <Text style={styles.tituloDecorado}></Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={{ marginHorizontal: 13, borderRadius: 20, overflow: "hidden", backgroundColor: "#fff" }}>
        <YoutubePlayer
          height={215}
          play={false}
          videoId={extractYouTubeId(video.url_video)}
        />
      </View>

      <View style={{ marginHorizontal: 13, marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.videoTitulo}>{video.titulo}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.detallesPill}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
                {video.precio && video.precio !== "0" ? `${video.precio} €` : "Gratis"}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={10}
              style={{ marginLeft: 9 }}
              onPress={() => toggleFavorito(video.id)}
            >
              <Feather
                name="bookmark"
                size={24}
                color={favoritos.includes(video.id) ? "#2B74E4" : "#bbb"}
                fill={favoritos.includes(video.id) ? "#2B74E4" : 'none'}
                style={{
                  backgroundColor: favoritos.includes(video.id) ? "#eaf0fa" : 'transparent',
                  borderRadius: 8
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ color: "#2B74E4", fontWeight: "700", fontSize: 15, marginTop: 2, marginBottom: 4 }}>
          {catTexto}
        </Text>
        <Text style={styles.descripcionVideo} numberOfLines={3}>
          {video.descripcion || "Sin descripción."}
        </Text>
        <View style={[styles.statsRow, { marginLeft: 0, marginTop: 8 }]}>
          <Feather name="star" size={17} color="#ffc534" />
          <Text style={styles.ratingText}>{parseFloat(video.valoracion ?? '4.7').toFixed(1)}</Text>
          <Text style={styles.valoracionesText}>({video.numero_valoraciones ?? 0} valoraciones)</Text>
          <Text style={styles.leccionesText}>• {video.lecciones || 10} lecciones</Text>
        </View>
      </View>

      <View style={styles.autorCardExt}>
        <Image
          source={video.autor?.avatar_url ? { uri: video.autor.avatar_url } : undefined}
          style={styles.autorAvatar}
        />
        <View>
          <Text style={styles.autorNombre}>{video.autor?.nombre}</Text>
          <Text style={styles.autorRol}>{video.autor?.rol ?? "Creador"}</Text>
        </View>
      </View>

      <View style={{marginHorizontal: 15, marginTop: 18}}>
        <View style={{flexDirection:"row", alignItems:"center", marginBottom: 9}}>
          <Text style={styles.comentTitle}>Comentarios</Text>
          <Text style={styles.comentCountPill}>{comentarios.length}</Text>
        </View>
        {comentarios.length === 0 ? (
          <Text style={{color:"#aaa", marginLeft:4, marginBottom:12}}>Todavía no hay comentarios, ¡sé el primero!</Text>
        ) : (
          comentarios.map(com => (
            <View key={com.id} style={styles.comentCard}>
              <Image
                source={com.usuario?.avatar_url ? {uri: com.usuario.avatar_url} : undefined}
                style={styles.comentAvatar}
              />
              <View style={{flex:1, marginLeft:10}}>
                <View style={{flexDirection:"row", alignItems:"center", marginBottom:2}}>
                  <Text style={styles.comentAutor}>{com.usuario?.nombre ?? "Usuario"}</Text>
                  <Text style={styles.comentFecha}> • {com.fecha ?? "ahora"}</Text>
                </View>
                <Text style={styles.comentTexto}>{com.texto}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBackRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 9, marginHorizontal: 16 },
  backBtn: { backgroundColor: "#ececec", borderRadius: 30, width: 38, height: 38, alignItems: "center", justifyContent: "center", marginBottom: 5 },
  titleDetails: { fontWeight: "bold", fontSize: 19, color: "#253b5e", marginLeft: 3 },
  mediaBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden", position: "relative", width: "100%", height: 210, backgroundColor: "#dbe6fa", alignItems: "center", justifyContent: "center" },
  thumb: { width: "100%", height: 210, backgroundColor: "#dbe6fa" },
  playOverlay: { position: "absolute", top: "41%", left: "44%", zIndex: 4 },
  videoTitulo: { fontWeight: "800", fontSize: 22, color: "#232323", maxWidth: '68%' },
  detallesPill: { backgroundColor: "#2B74E4", borderRadius: 15, marginLeft: 10, paddingVertical: 5, paddingHorizontal: 15, alignSelf: "center" },
  descripcionVideo: { fontSize: 14, color: "#6a6a6a", marginHorizontal: 0, marginTop: 2, marginBottom: 2, lineHeight: 18 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  ratingText: { color: "#232323", fontWeight: 'bold', fontSize: 15, marginLeft: 5 },
  valoracionesText: { color: "#959dbd", fontSize: 13, marginLeft: 3 },
  leccionesText: { color: "#7a859e", fontSize: 12, marginLeft: 7 },
  autorCardExt: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 17,
    marginBottom: 18,
    padding: 14,
    elevation: 2,
    shadowColor: '#134cc7ff',
    shadowOpacity: 0.005,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 3 }
  },
  autorAvatar: { width: 33, height: 33, borderRadius: 16.5, marginRight: 11, backgroundColor: "#eee" },
  autorNombre: { fontWeight: 'bold', fontSize: 15, color: "#232323" },
  autorRol: { fontSize: 13, color: "#8a9bb0", marginTop: 1 },
  comentTitle: {fontSize: 17, fontWeight:"bold", color:"#253b5e"},
  comentCountPill: {backgroundColor:"#2B74E4", color:"#fff", fontWeight:"bold", fontSize:14,paddingHorizontal:10, paddingVertical:3, borderRadius:12, marginLeft:9},
  comentCard: {flexDirection:"row", alignItems:"flex-start", backgroundColor:"#fff", borderRadius:12, padding:11, marginBottom:10, shadowColor:"#e7eefa", shadowOpacity:0.12, elevation:1},
  comentAvatar: {width:32,height:32,borderRadius:16,backgroundColor:"#ececec"},
  comentAutor: {fontWeight:"bold", color:"#232323", fontSize:14, marginRight:6},
  comentFecha: {color:"#a4adc7", fontSize:11, marginTop:1},
  comentTexto: {color:"#232323", fontSize:13.3, marginTop:2, marginRight:2},
  tituloDecorado: {
  color: "#2B74E4",
  fontSize: 24,
  fontWeight: "900",
  letterSpacing: 1,
  flex: 1,
  textShadowColor: "#aac6ffff",
  textShadowOffset: { width: 0, height: 1.8 },
  textShadowRadius: 5,
  marginLeft: 20,
  marginBottom: 10
},
});