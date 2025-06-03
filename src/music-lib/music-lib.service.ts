import { Injectable } from '@nestjs/common';
import { AlbumService } from 'src/albums/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class MusicLibService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  deleteArtist(id: string) {
    this.albumService.setArtistToNull(id);
    this.trackService.setArtistToNull(id);
    const isExistInFavs =
      this.favoritesService.checkIsArtistExistInFavorites(id);
    if (isExistInFavs) this.favoritesService.deleteArtistFromFavorites(id);
    this.artistService.delete(id);
  }

  deleteAlbum(id: string) {
    this.trackService.setAlbumToNull(id);
    const isExistInFavs =
      this.favoritesService.checkIsAlbumExistInFavorites(id);
    if (isExistInFavs) this.favoritesService.deleteAlbumFromFavorites(id);
    this.albumService.delete(id);
  }

  deleteTrack(id: string) {
    const isExistInFavs =
      this.favoritesService.checkIsTrackExistInFavorites(id);
    if (isExistInFavs) this.favoritesService.deleteTrackFromFavorites(id);
    this.trackService.delete(id);
  }
}
