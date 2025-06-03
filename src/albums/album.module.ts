import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MusicLibModule } from 'src/music-lib/music-lib.module';

@Module({
  imports: [forwardRef(() => MusicLibModule)],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService],
})
export class AlbumModule {}
