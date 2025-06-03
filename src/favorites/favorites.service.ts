import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumService } from 'src/albums/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse, MessageResponse } from './favorites.interface';
import { ErorrMessagesEnum } from 'src/constants';

@Injectable()
export class FavoritesService {
  private favoriteArtistIds = new Set<string>();
  private favoriteAlbumIds = new Set<string>();
  private favoriteTrackIds = new Set<string>();

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  findAll(): FavoritesResponse {
    const tracks = this.trackService.findAllByIds([...this.favoriteTrackIds]);
    const artists = this.artistService.findAllByIds([
      ...this.favoriteArtistIds,
    ]);
    const albums = this.albumService.findAllByIds([...this.favoriteAlbumIds]);

    return { tracks: tracks, albums: albums, artists: artists };
  }

  addTrackToFavorites(id: string): MessageResponse {
    try {
      this.trackService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        ErorrMessagesEnum.ARTIST_NOT_EXIST,
      );
    }

    this.favoriteTrackIds.add(id);

    return { message: 'Track was added to favorites' };
  }

  checkIsTrackExistInFavorites(id: string): boolean {
    return this.favoriteTrackIds.has(id);
  }

  checkIsAlbumExistInFavorites(id: string): boolean {
    return this.favoriteAlbumIds.has(id);
  }

  checkIsArtistExistInFavorites(id: string): boolean {
    return this.favoriteArtistIds.has(id);
  }

  deleteTrackFromFavorites(id: string): MessageResponse {
    const track = this.trackService.findById(id);

    if (!track) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    const favoriteTrack = this.favoriteTrackIds.has(id);

    if (!favoriteTrack) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    this.favoriteTrackIds.delete(id);
    return { message: 'Track was deleted from favorites' };
  }

  addAlbumToFavorites(id: string): MessageResponse {
    try {
      this.albumService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        ErorrMessagesEnum.ARTIST_NOT_EXIST,
      );
    }

    this.favoriteAlbumIds.add(id);

    return { message: 'The album was added to favorites.' };
  }

  deleteAlbumFromFavorites(id: string): MessageResponse {
    const album = this.albumService.findById(id);

    if (!album) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    const isExistInFavs = this.favoriteAlbumIds.has(id);

    if (!isExistInFavs) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_IN_FAVS);
    }

    this.favoriteAlbumIds.delete(album.id);

    return { message: 'The album was deleted from favorites.' };
  }

  addArtistToFavorites(id: string): MessageResponse {
    try {
      this.artistService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        ErorrMessagesEnum.ARTIST_NOT_EXIST,
      );
    }

    this.favoriteArtistIds.add(id);

    return { message: 'The artist was added to favorites.' };
  }

  deleteArtistFromFavorites(id: string): MessageResponse {
    const artist = this.artistService.findById(id);

    if (!artist) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    const isExistInFavs = this.favoriteArtistIds.has(id);

    if (!isExistInFavs) {
      throw new NotFoundException(ErorrMessagesEnum.ARTIST_NOT_IN_FAVS);
    }
    this.favoriteArtistIds.delete(artist.id);

    return { message: 'The artist was deleted from favorites.' };
  }
}
