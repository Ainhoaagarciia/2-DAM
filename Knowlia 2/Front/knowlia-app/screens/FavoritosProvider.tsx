import React, { createContext, useCallback, useContext, useState } from 'react';

const FavoritosContext = createContext<any>(null);

export function useFavoritos() {
  return useContext(FavoritosContext);
}

export function FavoritosProvider({ userId, children }: any) {
  const [favoritos, setFavoritos] = useState<number[]>([]);

  const fetchFavoritos = useCallback(() => {
    fetch(`http://10.0.2.2:3000/favorito?usuario_id=${userId}`)
      .then(res => res.json())
      .then(data => setFavoritos(data.map((fav: any) => fav.video.id)));
  }, [userId]);

  const toggleFavorito = async (videoId: number) => {
    const esFavorito = favoritos.includes(videoId);
    try {
      let res;
      if (esFavorito) {
        res = await fetch(`http://10.0.2.2:3000/favorito/${videoId}?usuario_id=${userId}`, { method: 'DELETE' });
      } else {
        res = await fetch(`http://10.0.2.2:3000/favorito/${videoId}?usuario_id=${userId}`, { method: 'POST' });
      }
      fetchFavoritos();
    } catch (error) {
    }
  };

  React.useEffect(() => { fetchFavoritos(); }, [fetchFavoritos]);

  return (
    <FavoritosContext.Provider value={{ favoritos, fetchFavoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}