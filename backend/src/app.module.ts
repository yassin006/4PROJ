import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IncidentsModule } from './incidents/incidents.module';
import { StatsModule } from './stats/stats.module';
import { PredictionsModule } from './predictions/predictions.module';
import { RoutesModule } from './routes/routes.module';
import { NotificationsModule } from './notifications/notifications.module'; // ✅ Add this line

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'docker'
        ? process.env.MONGODB_URI_DOCKER || 'mongodb://mongo:27017/trafine_db'
        : process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/trafine_db',
    ),
    UsersModule,
    AuthModule,
    IncidentsModule,
    StatsModule,
    PredictionsModule,
    RoutesModule,
    NotificationsModule, // ✅ Fix: Now your /notifications routes will work
  ],
})
export class AppModule {}
