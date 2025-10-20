import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/User.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: parseInt(cfg.get('DB_PORT', '5432')),
        username: cfg.get('DB_USER', 'root'),
        password: cfg.get('DB_PASS', 'root'),
        database: cfg.get('DB_NAME', 'usersdb'),
        entities: [User],
        synchronize: true, // DEV only
      }),
      inject: [ConfigService],
    }),
    UsersModule
  ],
})
export class AppModule {}
