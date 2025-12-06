import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        load: [config],
        envFilePath:

        process.env.NODE_ENV === 'prod'
        ? '.prod.env'
        : process.env.NODE_ENV === 'stg'
        ? '.stg.env'
        : '.env',
        }),
    TypeOrmModule.forRootAsync({
        name: 'default',
        inject: [config.KEY],
        useFactory: (cfg: ConfigType<typeof config>) => {
        const { postgres } = cfg;
        return {
        type: 'postgres',
        host: postgres.host,
        port: postgres.port,
        username: postgres.user,
        password: postgres.password,
        database: postgres.dbName,
        synchronize: true, // true solo en desarrollo. ¡En producción debe ser false!
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false }, // Permite certificados autofirmados
        // logging: true, // Útil para debug
        };
    },
}),],
        
    providers: [],
    exports: [],
})
export class DatabaseModule {}
