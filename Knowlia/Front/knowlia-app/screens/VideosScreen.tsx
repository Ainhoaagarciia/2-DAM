import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFavoritos } from './FavoritosProvider';

const USUARIO_ID = 1;
const API = 'http://10.0.2.2:3000';

function PortadaVideo({ thumbnail, onPress, style, iconSize = 42 }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={[{ position: "relative", overflow: "hidden" }, style]}
    >
      {thumbnail ? (
        <Image
          source={{ 
            uri: thumbnail.startsWith('http') 
              ? thumbnail 
              : `https://knowlia.s3.us-east-1.amazonaws.com/${thumbnail}` 
          }}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: style?.borderRadius || 0 }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View style={[style, { backgroundColor: "#eaf0fa", alignItems: "center", justifyContent: "center" }]}>
          <Feather name="film" size={iconSize} color="#8c99af" />
        </View>
      )}
      {/* ... icono play ... */}
      <Feather name="play-circle" size={iconSize} color="#fff" style={{ position: 'absolute', top: "50%", left: "50%", marginLeft: -iconSize/2, marginTop: -iconSize/2, zIndex: 20, opacity: 0.91 }} />
    </TouchableOpacity>
  );
}

export default function VideosScreen() {
  const [videos, setVideos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const { favoritos, toggleFavorito, fetchFavoritos } = useFavoritos() as any;
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<any>(null);
  const [search, setSearch] = useState('');
  const navigation = useNavigation() as any;

  useEffect(() => {
    fetch(`${API}/categoria`)
      .then(res => res.json())
      .then(data => {
        // Asegurarnos de que `categorias` sea siempre un array.
        if (Array.isArray(data)) setCategorias(data);
        else if (Array.isArray(data?.categorias)) setCategorias(data.categorias);
        else setCategorias([]);
      })
      .catch(() => setCategorias([]));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoritos();
    }, [])
  );

  useEffect(() => {
    let url = `${API}/video`;
    const params: string[] = [];
    if (categoriaSeleccionada) params.push(`category=${categoriaSeleccionada}`);
    if (search.length > 0) params.push(`q=${encodeURIComponent(search)}`);
    if (params.length) url += `?${params.join('&')}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setVideos(data.videos ?? data));
  }, [categoriaSeleccionada, search]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f8ff", paddingTop: 40 }}>
      <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          marginTop: 20,
          marginBottom: 20
        }}>
          <Text style={styles.tituloDecorado}>EXPLORA:</Text>
          <TouchableOpacity
            style={styles.botonCirculo}
            onPress={() => navigation.navigate("UploadScreen")}
          >
            <Feather name="plus" size={22} color="#fff" />
          </TouchableOpacity>
      </View>
      <Text style={{
          color: "#6ea1f8ff",
          fontSize: 14,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginLeft: 18,
          marginBottom: 12,
          marginTop: -18
        }}>
        ¡Tu aprendizaje empieza aquí!
      </Text>
      <View style={styles.inputBuscadorWrap}>
        <Feather name="search" size={21} color="#818181ff" style={{ marginLeft: 8, marginRight: 6 }} />
        <TextInput
          placeholder="Buscar videos..."
          placeholderTextColor="#818181ff"
          style={styles.inputBuscador}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={{ height: 54, marginTop: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: 12 }}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <TouchableOpacity
            style={[styles.categoriaBtn, categoriaSeleccionada === null && styles.categoriaBtnActiva]}
            onPress={() => setCategoriaSeleccionada(null)}
          >
            <Text style={[styles.categoriaTexto, categoriaSeleccionada === null && styles.categoriaTextoActivo]}>Todos</Text>
          </TouchableOpacity>
          {categorias.map(categoria =>
            <TouchableOpacity
              key={categoria.id}
              style={[styles.categoriaBtn, categoriaSeleccionada === categoria.id && styles.categoriaBtnActiva]}
              onPress={() => setCategoriaSeleccionada(categoria.id)}
            >
              <Text style={[styles.categoriaTexto, categoriaSeleccionada === categoria.id && styles.categoriaTextoActivo]}>
                {categoria.nombre}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
      <FlatList
        data={videos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.93}
            onPress={() => navigation.navigate('VideoDetailsScreen', { videoId: item.id })}
          >
            <PortadaVideo
              thumbnail={item.clave_thumbnail}
              style={styles.thumbnailPlaceholder}
              iconSize={44}
              onPress={() => navigation.navigate('VideoDetailsScreen', { videoId: item.id })}
            />
            <View style={[{ flex: 1, paddingLeft: 12 }, styles.cardContent]}>
              <Text style={styles.categoriaMini}>
                {item.videoCategorias && item.videoCategorias.length > 0
                  ? item.videoCategorias[0].categoria.nombre
                  : "Sin categoría"}
              </Text>
              <Text style={styles.tituloCurso}>{item.titulo}</Text>
              <View style={styles.rowAutor}>
                {item.autor?.avatar_url
                  ? <Image source={{ uri: item.autor.avatar_url }} style={styles.avatarPerfil} />
                  : <View style={[styles.avatarPerfil, { backgroundColor: "#eaf0fa", alignItems: "center", justifyContent: "center" }]}> 
                    <Feather name="user" size={14} color="#8c99af" />
                  </View>
                }
                <Text style={styles.autorNombre}>{item.autor ? item.autor.nombre : "---"}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <View style={styles.valoracionWrap}>
                  <Feather name="star" size={17} color="#ffc534" />
                  <Text style={styles.rating}>
                    {parseFloat(item.valoracion ?? "4.7").toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.count}>({item.numero_valoraciones ?? 0})</Text>
                <Text style={styles.precioPill}>
                  {item.precio && item.precio !== "0" ? `${item.precio} €` : "Gratis"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.iconoFavorito}
              onPress={() => toggleFavorito(item.id)}
              hitSlop={12}
            >
              <Feather
                name="bookmark"
                size={26}
                color={favoritos.includes(item.id) ? "#2B74E4" : "#bbb"}
                fill={favoritos.includes(item.id) ? "#2B74E4" : 'none'}
                style={{
                  backgroundColor: favoritos.includes(item.id) ? "#eaf0fa" : 'transparent',
                  borderRadius: 10,
                  padding: 2
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 27, fontWeight: "bold", flex: 1 },
  botonCirculo: {
    marginLeft: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2B74E4',
    alignItems: "center",
    justifyContent: "center",
    elevation: 3
  },
  inputBuscadorWrap: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
    elevation: 2
  },
  inputBuscador: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: "#222"
  },
  categoriaBtn: {
  minWidth: 82,
  paddingHorizontal: 16,
  height: 38,
  backgroundColor: "transparent",
  borderRadius: 18,
  marginRight: 9,
  justifyContent: 'center',
  marginBottom: 11,
  alignItems: 'center',
  borderWidth: 1.5,
  borderColor: "#2B74E4",
},
categoriaBtnActiva: {
  backgroundColor: '#2B74E4',
  borderColor: "#2B74E4",
},
categoriaTexto: {
  color: '#134cc7ff',
  fontWeight: '600',
  fontSize: 15
},
categoriaTextoActivo: {
  color: '#fff',
  fontWeight: '700'
},
  card: {
    flexDirection: 'row',
    padding: 11,
    borderRadius: 18,
    backgroundColor: '#fff',
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#134cc7ff',
    shadowOpacity: 0.005,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 }
  },
 thumbnailPlaceholder: {
  width: 132,
  height: 110,
  borderRadius: 10,
  backgroundColor: "#eaf0fa",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
  overflow: "hidden",
},
  categoriaMini: {
    color: "#2B74E4", fontWeight: 'bold', fontSize: 13, marginBottom: 2,
  },
  tituloCurso: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  autorTexto: { color: "#777", fontSize: 13, marginBottom: 2 },
  avatarPerfil: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#eaeaea'
  },
  autorNombre: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600"
  },
  valoracionWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginRight: 6,
  },
  rating: {
    color: "#232323",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 5,
    marginRight: -2
  },
  count: {
    color: "#aaa", fontSize: 12, marginRight: 10
  },
  precioPill: {
    backgroundColor: "#2B74E4",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 17,
    marginLeft: 14,
    alignSelf: "flex-start",
    overflow: "hidden"
  },
  iconoFavorito: {
    marginLeft: 8,
    padding: 2,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  rowAutor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  rowRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  cardContent: {
    position: 'relative',
    paddingRight: 20
  },
  tituloDecorado: {
  color: "#232323",
  fontSize: 25,
  fontWeight: "900",
  letterSpacing: 1,
  flex: 1,
  textShadowColor: "#aac6ffff",
  textShadowOffset: { width: 0, height: 1.8 },
  textShadowRadius: 5,
  marginRight: 5
},

});