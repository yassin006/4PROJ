import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IncidentsModule } from './incidents/incidents.module';
import { StatsModule } from './stats/stats.module';
import { PredictionsModule } from './predictions/predictions.module'; // ✅ Ajouté

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local',
      isGlobal: true,
    }),    
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/trafine_db'),
    UsersModule,
    AuthModule,
    IncidentsModule,
    StatsModule,
    PredictionsModule, // ✅ Activation du module de prédictions
  ],
})
export class AppModule {}
