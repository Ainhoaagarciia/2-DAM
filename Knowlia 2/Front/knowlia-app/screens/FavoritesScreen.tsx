import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const API = 'http://10.0.2.2:3000';

function PortadaVideo({ thumbnail, onPress, style, iconSize = 48 }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={[{ position: "relative" }, style]}>
      {thumbnail ? (
        <Image
          source={{ 
            uri: thumbnail.startsWith('http') 
              ? thumbnail 
              : `https://knowlia.s3.us-east-1.amazonaws.com/${thumbnail}` 
          }}
          style={[style, { backgroundColor: "#eaf0fa" }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[style, { backgroundColor: "#eaf0fa", alignItems: "center", justifyContent: "center" }]}>
          <Feather name="film" size={iconSize} color="#8c99af" />
        </View>
      )}
      <Feather name="play-circle" size={iconSize} color="#fff" style={{ position: 'absolute', top: "50%", left: "50%", marginLeft: -iconSize / 2, marginTop: -iconSize / 2, zIndex: 15, opacity: 0.92 }} />
    </TouchableOpacity>
  );
}

export default function FavoritosScreen() {
  const navigation = useNavigation() as any;
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<any[]>([]);

  const fetchFavoritos = () => {
    if(!user) return;
    fetch(`${API}/favorito?usuario_id=${user.id}`)
      .then(res => res.json())
      .then(data => setFavoritos(data));
  };

  const quitarFavorito = async (videoId: number) => {
    if(!user) return;
    await fetch(`${API}/favorito/${videoId}?usuario_id=${user.id}`, { method: 'DELETE' });
    fetchFavoritos();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoritos();
    }, [user])
  );

  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: "#f5f8ff" }}> 
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 16, marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.tituloDecorado}>FAVORITOS:</Text>
        <TouchableOpacity
          style={{ backgroundColor: "#fff", borderRadius: 19, width: 38, height: 38, alignItems: "center", justifyContent: "center", marginLeft: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }}
          onPress={() => navigation.navigate('Videos')}
        >
          <Feather name="film" size={22} color="#2B74E4" />
        </TouchableOpacity>
      </View>
      <Text style={{ color: "#6ea1f8ff", fontSize: 14, fontWeight: '600', letterSpacing: 0.3, marginLeft: 18, marginTop: -17, marginBottom: 10 }}>
        ¡Vuelve a disfrutar de tu contenido favorito!
      </Text>
      
      <FlatList
        data={favoritos}
        keyExtractor={item => item.video.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 110 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardFavorito}
            activeOpacity={0.93}
            onPress={() => navigation.navigate('VideoDetailsScreen' as any, { videoId: item.video.id })}
          >
            <PortadaVideo
              thumbnail={item.video.clave_thumbnail}
              style={styles.portada}
              iconSize={46}
              onPress={() => navigation.navigate('VideoDetailsScreen' as any, { videoId: item.video.id })}
            />
            <View style={styles.infoFavorito}>
              <Text style={styles.categoriaMini}>
                {item.video.videoCategorias && item.video.videoCategorias.length > 0
                  ? item.video.videoCategorias[0].categoria.nombre
                  : "Sin categoría"}
              </Text>
              <Text style={styles.tituloCurso}>{item.video.titulo}</Text>
              <View style={styles.rowDatos}>
                {item.video.autor?.avatar_url
                  ? <Image source={{ uri: item.video.autor.avatar_url }} style={styles.avatarPerfil} />
                  : (
                    <View style={[styles.avatarPerfil, { backgroundColor: "#eaf0fa", alignItems: "center", justifyContent: "center" }]}> 
                      <Feather name="user" size={18} color="#8c99af" />
                    </View>
                  )
                }
                <Text style={styles.autorNombre}>{item.video.autor ? item.video.autor.nombre : "---"}</Text>
                <View style={styles.valoracionWrap}>
                  <Feather name="star" size={17} color="#ffc534" />
                  <Text style={styles.rating}>{parseFloat(item.video.valoracion ?? "4.7").toFixed(1)}</Text>
                </View>
                <Text style={styles.count}>({item.video.numero_valoraciones ?? 1500})</Text>
                <Text style={styles.precioPill}>
                  {item.video.precio && item.video.precio !== "0" ? `${item.video.precio} €` : "Gratis"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.btnFav} onPress={() => quitarFavorito(item.video.id)}>
              <Feather name="bookmark" size={26} color={"#2B74E4"} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Feather name="bookmark" size={40} color="#cbd5e1" />
                <Text style={{ color: '#94a3b8', marginTop: 10, fontSize: 15 }}>Aún no tienes favoritos.</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tituloDecorado: { color: "#232323", fontSize: 25, fontWeight: "900", letterSpacing: 1, textShadowColor: "#aac6ffff", textShadowOffset: { width: 0, height: 1.8 }, textShadowRadius: 5, marginRight: 5 },
  cardFavorito: { borderRadius: 18, marginBottom: 18, backgroundColor: '#fff', shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3, overflow: "hidden", position: "relative" },
  portada: { width: "100%", height: 200, backgroundColor: "#f1f5f9" },
  infoFavorito: { padding: 16, paddingBottom: 14 },
  categoriaMini: { color: "#2B74E4", fontWeight: 'bold', fontSize: 14, marginBottom: 3 },
  tituloCurso: { fontWeight: "bold", fontSize: 18, marginBottom: 8, color: "#1e293b" },
  rowDatos: { flexDirection: 'row', alignItems: 'center', marginTop: 2, flexWrap: 'wrap' },
  avatarPerfil: { width: 24, height: 24, borderRadius: 12, marginRight: 6, backgroundColor: '#f1f5f9' },
  autorNombre: { fontSize: 13, color: "#64748b", marginRight: 10, fontWeight: "600" },
  valoracionWrap: { flexDirection: "row", alignItems: "center", marginRight: 6 },
  rating: { color: "#1e293b", fontWeight: "bold", fontSize: 14, marginLeft: 4 },
  count: { color: "#94a3b8", fontSize: 12, marginRight: 10 },
  precioPill: { backgroundColor: "#2B74E4", color: "#fff", fontWeight: "bold", fontSize: 14, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 14, marginLeft: 'auto', overflow: "hidden" },
  btnFav: { position: "absolute", top: 16, right: 16, zIndex: 2, backgroundColor: '#fff', borderRadius: 12, padding: 6 },
});