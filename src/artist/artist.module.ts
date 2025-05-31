import { Module, forwardRef } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/albums/album.module';

@Module({
  imports: [forwardRef(() => TrackModule), forwardRef(() => AlbumModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
