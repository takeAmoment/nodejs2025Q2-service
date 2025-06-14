import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AlbumModule } from './albums/album.module';
import { PrismaModule } from 'src/prismaService/prismaService.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { LoggingService } from './shared/logger/logging.service';
import { AppExceptionFilter } from './shared/filters/app-exceptions.filter';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    FavoritesModule,
    AlbumModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
