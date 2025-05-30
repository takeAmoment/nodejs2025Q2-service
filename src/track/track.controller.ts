import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { RoutingPathsEnum } from 'src/constants';
import { CreateTrackDto } from './dto/createTrack.dto';
import { ParseUUDIPipe } from 'src/shared/pipes/parse-uudi.pipe';
import { UpdateTrackDto } from './dto/updateTrack.dto';

@Controller(RoutingPathsEnum.TRACK)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUDIPipe) id: string) {
    return this.trackService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTrackDto) {
    return this.trackService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUDIPipe) id: string, @Body() dto: UpdateTrackDto) {
    return this.trackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseUUDIPipe) id: string) {
    return this.trackService.delete(id);
  }
}
