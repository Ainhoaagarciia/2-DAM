import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useFavoritos } from './FavoritosProvider';

import { PERMISSIONS } from '../config/permissions';
import { useAuth } from '../context/AuthContext';

const API = 'http://10.0.2.2:3000';

function extractYouTubeId(url: string | null) {
  if (!url) return null;
  const regExp = /(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function VideoDetailsScreen() {
  const navigation = useNavigation() as any;
  const route = useRoute();
  const { videoId } = (route.params as any) || {};
  
  const { can } = useAuth(); 
  
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
        { id: 1, texto: "¡Muy buen vídeo, muy claro! Me encantó la manera en la que explica los conceptos.", fecha: "hace 2 días", usuario: { nombre: "Marina", avatar_url: "https://randomuser.me/api/portraits/women/1.jpg" } },
        { id: 2, texto: "Me ha quedado clarísimo cómo funciona! La explicación es clara y sencilla.", fecha: "hace 1 día", usuario: { nombre: "Luis", avatar_url: "https://randomuser.me/api/portraits/men/3.jpg" } },
        { id: 3, texto: "¡Genial! La calidad del audio y vídeo es de 10.", fecha: "hace 4 horas", usuario: { nombre: "Andrea", avatar_url: "https://randomuser.me/api/portraits/women/60.jpg" } }
      ]);
    }, 400);
  }, [videoId]);

  const handleDelete = () => {
    Alert.alert(
        "Borrar Video",
        "¿Estás seguro? Esta acción no se puede deshacer.",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Borrar", style: "destructive", 
                onPress: () => {
                    Alert.alert("Video eliminado");
                    navigation.goBack();
                }
            }
        ]
    );
  };

  if (!video || loading)
    return <ActivityIndicator size="large" color="#2B74E4" style={{ marginTop: 90 }} />;

  const catTexto = video.videoCategorias && video.videoCategorias.length > 0
    ? video.videoCategorias[0]?.categoria?.nombre
    : "Sin categoría";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f8ff" }} contentContainerStyle={{ paddingBottom: 48, paddingTop: 50 }}>
      
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        {(can(PERMISSIONS.ITEM_EDIT) || can(PERMISSIONS.ITEM_DEACTIVATE)) && (
            <View style={{flexDirection: 'row', gap: 12}}>
               {can(PERMISSIONS.ITEM_EDIT) && (
                 <TouchableOpacity 
                    style={[styles.roundBtn, {backgroundColor: '#fff'}]}
                    onPress={() => navigation.navigate('EditVideoScreen', { videoId: video.id })}
                 >
                    <Feather name="edit-2" size={20} color="#2B74E4" />
                 </TouchableOpacity>
               )}
               {can(PERMISSIONS.ITEM_DEACTIVATE) && (
                 <TouchableOpacity 
                    style={[styles.roundBtn, {backgroundColor: '#fff'}]}
                    onPress={handleDelete}
                 >
                    <Feather name="trash-2" size={20} color="#ef4444" />
                 </TouchableOpacity>
               )}
            </View>
        )}
      </View>

      <View style={styles.videoCard}>
        <YoutubePlayer
          height={220}
          play={false}
          videoId={extractYouTubeId(video.url_video)}
        />
      </View>

      <View style={{ marginHorizontal: 22, marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Text style={styles.videoTitulo}>{video.titulo}</Text>
          
          <TouchableOpacity
              hitSlop={10}
              style={styles.bookmarkBtn}
              onPress={() => toggleFavorito(video.id)}
            >
              <Feather
                name="bookmark"
                size={24}
                color={favoritos.includes(video.id) ? "#2B74E4" : "#cbd5e1"}
                fill={favoritos.includes(video.id) ? "#2B74E4" : 'none'}
              />
            </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
            <Text style={styles.categoriaTag}>{catTexto}</Text>
            <View style={styles.precioPill}>
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>
                    {video.precio && video.precio !== "0" ? `${video.precio} €` : "Gratis"}
                </Text>
            </View>
        </View>

        <Text style={styles.descripcionVideo}>
          {video.descripcion || "Sin descripción disponible para este curso."}
        </Text>

        <View style={styles.statsRow}>
          <Feather name="star" size={18} color="#ffc534" />
          <Text style={styles.ratingText}>{parseFloat(video.valoracion ?? '4.7').toFixed(1)}</Text>
          <Text style={styles.valoracionesText}>({video.numero_valoraciones ?? 0} valoraciones)</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.leccionesText}>{video.lecciones || 12} lecciones</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.autorSection}>
        <Image
          source={video.autor?.avatar_url ? { uri: video.autor.avatar_url } : undefined}
          style={styles.autorAvatar}
        />
        <View style={{flex: 1}}>
          <Text style={styles.autorLabel}>{video.autor?.rol}</Text>
          <Text style={styles.autorNombre}>{video.autor?.nombre}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={{marginHorizontal: 22, marginTop: 10}}>
        <View style={{flexDirection:"row", alignItems:"center", marginBottom: 15}}>
          <Text style={styles.comentTitle}>Comentarios</Text>
          <View style={styles.comentCountPill}>
             <Text style={{color:"#2B74E4", fontWeight:"bold", fontSize:12}}>{comentarios.length}</Text>
          </View>
        </View>
        {comentarios.map(com => (
            <View key={com.id} style={styles.comentCard}>
              <Image source={com.usuario?.avatar_url ? {uri: com.usuario.avatar_url} : undefined} style={styles.comentAvatar} />
              <View style={{flex:1, marginLeft:12}}>
                <View style={{flexDirection:"row", alignItems:"center", marginBottom:4}}>
                  <Text style={styles.comentAutor}>{com.usuario?.nombre ?? "Usuario"}</Text>
                  <Text style={styles.comentFecha}>{com.fecha ?? "ahora"}</Text>
                </View>
                <Text style={styles.comentTexto}>{com.texto}</Text>
              </View>
            </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  
  roundBtn: { backgroundColor: "#fff", borderRadius: 25, width: 44, height: 44, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  
  videoCard: { marginHorizontal: 18, borderRadius: 24, overflow: "hidden", backgroundColor: "#000", shadowColor: "#2B74E4", shadowOpacity: 0.15, shadowRadius: 12, elevation: 6, borderWidth: 1, borderColor: '#fff' },
  
  videoTitulo: { fontWeight: "800", fontSize: 22, color: "#1e293b", flex: 1, marginRight: 15, lineHeight: 28, marginTop: 5 },
  
  bookmarkBtn: { padding: 4 },
  
  categoriaTag: { color: "#2B74E4", fontWeight: "700", fontSize: 13, backgroundColor: '#eaf2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  precioPill: { backgroundColor: "#2B74E4", borderRadius: 8, marginLeft: 8, paddingVertical: 4, paddingHorizontal: 12 },
  
  descripcionVideo: { fontSize: 15, color: "#64748b", marginTop: 14, marginBottom: 12, lineHeight: 24 },
  
  statsRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  ratingText: { color: "#1e293b", fontWeight: '800', fontSize: 16, marginLeft: 6 },
  valoracionesText: { color: "#94a3b8", fontSize: 13, marginLeft: 4, fontWeight: "500" },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', marginHorizontal: 10 },
  leccionesText: { color: "#64748b", fontSize: 13, fontWeight: "600" },
  
  separator: { height: 1, backgroundColor: '#c9def8ff', marginVertical: 20, marginHorizontal: 22 },

  autorSection: { flexDirection: "row", alignItems: "center", paddingHorizontal: 22 },
  autorAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 14, backgroundColor: "#eee" },
  autorLabel: { fontSize: 12, color: '#2B74E4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  autorNombre: { fontWeight: '800', fontSize: 17, color: "#1e293b" },

  comentTitle: {fontSize: 19, fontWeight:"800", color:"#1e293b"},
  comentCountPill: {backgroundColor:"#dbeafe", paddingHorizontal:8, paddingVertical:2, borderRadius:8, marginLeft:10},
  comentCard: {flexDirection:"row", alignItems:"flex-start", backgroundColor:"#fff", borderRadius:16, padding:16, marginBottom: 14, shadowColor:"#000", shadowOpacity:0.02, elevation: 1},
  comentAvatar: {width:38,height:38,borderRadius:19,backgroundColor:"#f1f5f9"},
  comentAutor: {fontWeight:"700", color:"#334155", fontSize: 14, marginRight: 8},
  comentFecha: {color:"#94a3b8", fontSize: 12, fontWeight: '500'},
  comentTexto: {color:"#475569", fontSize: 14, marginTop: 4, lineHeight: 21},
});