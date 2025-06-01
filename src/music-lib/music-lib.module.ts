import { Module, forwardRef } from '@nestjs/common';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TrackModule } from 'src/track/track.module';
import { MusicLibService } from './music-lib.service';
import { AlbumModule } from 'src/albums/album.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
  ],
  providers: [MusicLibService],
  exports: [MusicLibService],
})
export class MusicLibModule {}
