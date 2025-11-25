import { DataSource } from 'typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { Video } from './video/entities/video.entity';
import { Categoria } from './categoria/entities/categoria.entity';
import { Favorito } from './favorito/entities/favorito.entity';
import { VideoCategoria } from './video_categoria/entities/video_categoria.entity';
require('dotenv').config({ path: '../.env' }); // Ajusta el path si ejecutas desde la raíz o src          npx ts-node src/seed.ts

// Configura aquí la conexión igual que en tu data-source o main app
const dataSource = new DataSource({
  // usa la configuración exacta de conexión a tu BD
  type: 'postgres',
  host: 'knowlia.c17gx4jklxtz.us-east-1.rds.amazonaws.com',
  port: 5432,
  username: 'postgres',
  password: 'knowlia-sprint',
  database: 'postgres',
  entities: [Usuario, Video, Categoria, Favorito, VideoCategoria],
  synchronize: false,
  logging: false,
  ssl: { rejectUnauthorized: false }, // <--- necesario para RDS
});

async function seed() {
  await dataSource.initialize();

  const usuarioRepo = dataSource.getRepository(Usuario);
  const videoRepo = dataSource.getRepository(Video);
  const categoriaRepo = dataSource.getRepository(Categoria);
  const favoritoRepo = dataSource.getRepository(Favorito);
  const videoCategoriaRepo = dataSource.getRepository(VideoCategoria);

  // Ejemplo crear usuarios
  for(let i=1; i<=10; i++) {
    const campos: any = {
        nombre: `Usuario ${i}`,
        correo: `user${i}@correo.com`,
        contrasena: 'hashedpass123',
        rol: i % 2 === 0 ? 'profesor' : 'estudiante'
    };
    if (i % 3 == 0) campos.avatar_url = `https://randomuser.me/api/portraits/men/${i}.jpg`;
    const usuario = usuarioRepo.create(campos);
    await usuarioRepo.save(usuario);
  }

  // Crear categorías
  const categorias = ['Matemáticas', 'Historia', 'Bases de datos', 'Diseño'];
  for(const nombre of categorias) {
    const cat = categoriaRepo.create({ nombre });
    await categoriaRepo.save(cat);
  }

  // Crear videos
  for(let i=1; i<=30; i++) {
  // Determina el autorId para el vídeo
  const autorId = i <= 5 ? i : 1; // 1 a 5 usan sus propios ids, los demás usan el usuario 1
  const video = videoRepo.create({
    titulo: `Video ${i}`,
    descripcion: `Descripción del video ${i}`,
    precio: i % 5 === 0 ? 10 : 0,
    url_video: `https://youtu.be/video${i}`,
    clave_thumbnail: `thumbnails/thumb${i}.png`,
    autor: { id: autorId }, // ¡IMPORTANTE!
  });
  await videoRepo.save(video);
    }

// Ejemplo: cada vídeo tiene entre 1 y 2 categorías
    for (let i = 1; i <= 30; i++) {
    // Vídeo i con categoría 1 y (si existe) la categoría (i%4)+1
    await videoCategoriaRepo.save(videoCategoriaRepo.create({
    video: { id: i },
    categoria: { id: 1 }
  }));
  const segundaCategoriaId = (i % 4) + 1;
  if (segundaCategoriaId !== 1) {
    await videoCategoriaRepo.save(videoCategoriaRepo.create({
      video: { id: i },
      categoria: { id: segundaCategoriaId }
    }));
  }
}

  // Crear favoritos (opcional)
  for(let i=1; i<=10; i++) {
    const favorito = favoritoRepo.create({
    usuario: { id: i },
    video: { id: i },
    });
    await favoritoRepo.save(favorito);
  }

  await dataSource.destroy();
  console.log('Seed completado con éxito');
}

seed();