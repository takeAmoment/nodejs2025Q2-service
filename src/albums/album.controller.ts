import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { RoutingPathsEnum } from 'src/constants';
import { AlbumService } from './album.service';
import { ParseUUDIPipe } from 'src/shared/pipes/parse-uudi.pipe';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { MusicLibService } from 'src/music-lib/music-lib.service';

@Controller(RoutingPathsEnum.ALBUM)
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly musicLibService: MusicLibService,
  ) {}

  @Get()
  async findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUDIPipe) id: string) {
    return this.albumService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUDIPipe) id: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUDIPipe) id: string) {
    return this.musicLibService.deleteAlbum(id);
  }
}
