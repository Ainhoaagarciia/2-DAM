import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PERMISSIONS } from '../config/permissions';
import { useAuth } from '../context/AuthContext';

const API = 'http://10.0.2.2:3000';

function PortadaVideo({ thumbnail, style, iconSize = 24 }: any) {
  return (
    <View style={[{ position: "relative", overflow: "hidden" }, style]}>
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
    </View>
  );
}

export default function AdminPanelScreen() {
  const navigation = useNavigation() as any;
  const { user, can } = useAuth(); 
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !can(PERMISSIONS.ADMIN_PANEL_VIEW)) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }, [user]);

  const stats = [
    { label: 'Total Videos', value: videos.length, icon: 'film', color: '#2B74E4', bg: '#eaf2ff' },
    { label: 'Ventas', value: '1.2k €', icon: 'trending-up', color: '#10b981', bg: '#d1fae5' },
    { label: 'Alumnos', value: '340', icon: 'users', color: '#f59e0b', bg: '#fef3c7' },
  ];

  const fetchMisVideos = () => {
    setLoading(true);
    fetch(`${API}/video?autor_id=${user.id}&order=DESC`)
      .then(res => res.json())
      .then(data => {
         setVideos(data.videos ?? data);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Eliminar Video",
      "¿Estás seguro de que quieres eliminar este video permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: 'destructive',
          onPress: async () => {
             try {
               const res = await fetch(`${API}/video/${id}`, { method: 'DELETE' });
               if (res.ok) {
                 Alert.alert("Éxito", "Video eliminado correctamente");
                 fetchMisVideos(); 
               } else {
                 Alert.alert("Error", "No se pudo eliminar el video");
               }
             } catch (error) {
               Alert.alert("Error", "Fallo de conexión");
             }
          }
        }
      ]
    );
  };

  useEffect(() => { fetchMisVideos(); }, [user]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.cardItem}
      activeOpacity={0.95}
      onPress={() => navigation.navigate('VideoDetailsScreen', { videoId: item.id })}
    >
      {/* MINIATURA */}
      <PortadaVideo 
        thumbnail={item.clave_thumbnail} 
        style={styles.thumbnailList}
        iconSize={24}
      />
      
      {/* INFO CENTRAL */}
      <View style={{flex: 1, marginLeft: 12, justifyContent: 'center'}}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={styles.cardSub}>{item.videoCategorias?.[0]?.categoria?.nombre || "Sin categoría"}</Text>
            <View style={styles.separator} />
            <Feather name="star" size={11} color="#f59e0b" />
            <Text style={styles.metaText}>{parseFloat(item.valoracion ?? '0').toFixed(1)}</Text>
        </View>
      </View>
      
      {/* BOTONES DE ACCIÓN */}
      <View style={styles.actions}>
        {can(PERMISSIONS.ITEM_EDIT) && (
          <TouchableOpacity 
            style={styles.actionBtnEdit}
            onPress={() => navigation.navigate("EditVideoScreen", { videoId: item.id })}
          >
            <Feather name="edit-2" size={18} color="#2B74E4" />
          </TouchableOpacity>
        )}

        {can(PERMISSIONS.ITEM_DEACTIVATE) && (
          <TouchableOpacity 
            style={styles.actionBtnDelete}
            onPress={() => handleDelete(item.id)}
          >
            <Feather name="trash-2" size={18} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.headerRow}>
        <Text style={styles.tituloDecorado}>PANEL ADMIN:</Text>
        <TouchableOpacity 
            onPress={() => navigation.navigate('Videos')} 
            style={{padding: 5}}
        >
            <Feather name="more-vertical" size={24} color="#232323" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitleHeader}>
        Gestión y estadísticas de tu contenido
      </Text>
      
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: stat.bg }]}> 
               <Feather name={stat.icon as any} size={22} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Gestión de Contenido</Text>

      {loading ? <ActivityIndicator color="#2B74E4" style={{marginTop: 40}} size="large" /> : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 5 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
                <Feather name="inbox" size={40} color="#cbd5e1" />
                <Text style={styles.emptyText}>No tienes videos creados aún.</Text>
            </View>
          }
        />
      )}
      
      {can(PERMISSIONS.ITEM_CREATE) && (
        <TouchableOpacity 
            style={styles.fab}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("UploadScreen")}
        >
            <Feather name="plus" size={24} color="#fff" />
            <Text style={styles.fabText}>Nuevo Video</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f8ff", paddingTop: 45, paddingHorizontal: 20 },
  
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 2 },
  tituloDecorado: { 
    color: "#232323", 
    fontSize: 25, 
    fontWeight: "900", 
    letterSpacing: 1, 
    flex: 1, 
    textShadowColor: "#aac6ffff", 
    textShadowOffset: { width: 0, height: 1.8 }, 
    textShadowRadius: 5 
  },
  subtitleHeader: {
    color: "#6ea1f8ff",
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 25,
    marginTop: 0
  },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  statCard: { backgroundColor: "#fff", width: "31%", paddingVertical: 15, borderRadius: 16, alignItems: "center", shadowOpacity: 0.03, shadowRadius: 8, elevation: 6, shadowColor: '#134cc7ff',  // SOMBRA AZUL
    shadowOffset: { width: 0, height: 3 } },
  iconBox: { padding: 10, borderRadius: 12, marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: "800", color: "#1e293b" },
  statLabel: { fontSize: 11, color: "#64748b", fontWeight: "500" },

  sectionTitle: { color: "#2B74E4", fontSize: 19, fontWeight: "900", letterSpacing: 1, flex: 1, textShadowColor: "#aac6ffff", textShadowOffset: { width: 0, height: 1.3 }, textShadowRadius: 5, marginBottom: 15 },

  cardItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 14, 
    marginBottom: 11, 
    padding: 17, 
    elevation: 2, 
    shadowColor: '#134cc7ff', 
    shadowOpacity: 0.005, 
    shadowRadius: 2, 
    shadowOffset: { width: 0, height: 3 } 
  },
  
  thumbnailList: { width: 60, height: 60, borderRadius: 11, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#222", marginBottom: 1 },
  cardSub: { fontSize: 12, color: "#2B74E4", fontWeight: 'bold', opacity: 0.9 },
  separator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', marginHorizontal: 6 },
  metaText: { fontSize: 12, color: "#232323", marginLeft: 3, fontWeight: 'bold' },

  actions: { flexDirection: "row", gap: 8, marginLeft: 8 },
  actionBtnEdit: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#eff6ff", alignItems: "center", justifyContent: "center" },
  actionBtnDelete: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center" },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94a3b8', marginTop: 10, fontSize: 14 },

  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#2B74E4', flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30, elevation: 8, shadowColor: '#2B74E4', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 } },
  fabText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 15 }
});