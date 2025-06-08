import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse, MessageResponse } from './favorites.interface';
import { ErorrMessagesEnum } from 'src/constants';
import { Prisma, Track, Album, Artist } from '@prisma/client';
import { PrismaService } from 'src/prismaService/prismaService.service';

type FavoritesWithIncludes = Prisma.FavoritesGetPayload<{
  include: {
    favoriteAlbums: true;
    favoriteArtists: true;
    favoriteTracks: true;
  };
}>;

@Injectable()
export class FavoritesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFavorites(): Promise<FavoritesWithIncludes> {
    return this.prismaService.favorites.findFirst({
      include: {
        favoriteAlbums: true,
        favoriteArtists: true,
        favoriteTracks: true,
      },
    });
  }

  async getTrack(id: string): Promise<Track> {
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    return track;
  }

  async getAlbum(id: string): Promise<Album> {
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    return album;
  }

  async getArtist(id: string): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    return artist;
  }

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.getFavorites();

    const trackIds = [
      ...new Set(favorites.favoriteTracks.map((track) => track.id)),
    ];

    const artistIds = [
      ...new Set(favorites.favoriteArtists.map((artist) => artist.id)),
    ];

    const albumIds = [
      ...new Set(favorites.favoriteArtists.map((album) => album.id)),
    ];

    const tracks = await this.prismaService.track.findMany({
      where: { id: { in: trackIds } },
    });
    const artists = await this.prismaService.artist.findMany({
      where: { id: { in: artistIds } },
    });
    const albums = await this.prismaService.album.findMany({
      where: { id: { in: albumIds } },
    });

    return { tracks: tracks, albums: albums, artists: artists };
  }

  async addTrackToFavorites(id: string): Promise<MessageResponse> {
    try {
      await this.getAlbum(id);
    } catch (error) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }
    const favorites = await this.getFavorites();

    await this.prismaService.favorites.update({
      where: { id: favorites.id },
      data: { favoriteTracks: { connect: { id } } },
    });

    return { message: 'Track was added to favorites' };
  }

  async deleteTrackFromFavorites(id: string): Promise<MessageResponse> {
    try {
      await this.getAlbum(id);
    } catch (error) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }
    const favorites = await this.getFavorites();

    const favoriteTrack = favorites.favoriteTracks.find(
      (item) => item.id === id,
    );

    if (!favoriteTrack) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    await this.prismaService.favorites.update({
      where: { id: favorites.id },
      data: { favoriteTracks: { disconnect: { id: id } } },
    });
    return { message: 'Track was deleted from favorites' };
  }

  async addAlbumToFavorites(id: string): Promise<MessageResponse> {
    try {
      await this.getAlbum(id);
    } catch (error) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }
    const favorites = await this.getFavorites();

    await this.prismaService.favorites.update({
      where: { id: favorites.id },
      data: { favoriteAlbums: { connect: { id } } },
    });

    return { message: 'The album was added to favorites.' };
  }

  async deleteAlbumFromFavorites(id: string): Promise<MessageResponse> {
    try {
      await this.getAlbum(id);
    } catch (error) {
      throw new UnprocessableEntityException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }
    const favorites = await this.getFavorites();

    const isExistInFavs = favorites.favoriteAlbums.find(
      (item) => item.id === id,
    );

    if (!isExistInFavs) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_IN_FAVS);
    }

    await this.prismaService.favorites.update({
      where: { id: favorites.id },
      data: { favoriteAlbums: { disconnect: { id } } },
    });

    return { message: 'The album was deleted from favorites.' };
  }

  async addArtistToFavorites(id: string): Promise<MessageResponse> {
    try {
      await this.getArtist(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        ErorrMessagesEnum.ARTIST_NOT_EXIST,
      );
    }
    const favorites = await this.getFavorites();

    this.prismaService.favorites.update({
      where: { id: favorites.id },
      data: { favoriteArtists: { connect: { id } } },
    });

    return { message: 'The artist was added to favorites.' };
  }

  async deleteArtistFromFavorites(id: string): Promise<MessageResponse> {
    try {
      await this.getArtist(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        ErorrMessagesEnum.ARTIST_NOT_EXIST,
      );
    }
    const favorites = await this.getFavorites();

    const isExistInFavs = favorites.favoriteArtists.find(
      (item) => item.id === id,
    );

    if (!isExistInFavs) {
      throw new NotFoundException(ErorrMessagesEnum.ARTIST_NOT_IN_FAVS);
    }
    this.prismaService.favorites.update({
      where: { id: favorites.id },
      data: { favoriteArtists: { disconnect: { id } } },
    });

    return { message: 'The artist was deleted from favorites.' };
  }
}
