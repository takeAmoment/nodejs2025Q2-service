import { Module, forwardRef } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { MusicLibModule } from 'src/music-lib/music-lib.module';

@Module({
  imports: [forwardRef(() => MusicLibModule)],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
