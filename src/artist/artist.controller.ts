import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';

import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/createArtist.dto';
import { ParseUUDIPipe } from 'src/shared/pipes/parse-uudi.pipe';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import { RoutingPathsEnum } from 'src/constants';

@Controller(RoutingPathsEnum.ARTIST)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUDIPipe) id: string) {
    return this.artistService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUDIPipe) id: string, @Body() dto: UpdateArtistDto) {
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseUUDIPipe) id: string) {
    return this.artistService.delete(id);
  }
}
