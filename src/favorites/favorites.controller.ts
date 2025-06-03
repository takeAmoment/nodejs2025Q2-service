import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { RoutingPathsEnum } from 'src/constants';
import { ParseUUDIPipe } from 'src/shared/pipes/parse-uudi.pipe';

@Controller(RoutingPathsEnum.FAVS)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrackToFavorites(@Param('id', ParseUUDIPipe) id: string) {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrackFromFavorites(@Param('id', ParseUUDIPipe) id: string) {
    return this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Post('artist/:id')
  addArtistToFavorites(@Param('id', ParseUUDIPipe) id: string) {
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtistFromFavorites(@Param('id', ParseUUDIPipe) id: string) {
    return this.favoritesService.deleteArtistFromFavorites(id);
  }

  @Post('album/:id')
  addAlbumToFavorites(@Param('id', ParseUUDIPipe) id: string) {
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbumFromFavorites(@Param('id', ParseUUDIPipe) id: string) {
    return this.favoritesService.deleteAlbumFromFavorites(id);
  }
}
