import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './album.interface';
import { randomUUID } from 'crypto';
import { ErorrMessagesEnum } from 'src/constants';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = [];

  constructor(private readonly trackService: TrackService) {}

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album {
    const track = this.albums.find((item) => item.id === id);

    if (!track) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    return track;
  }

  create(dto: CreateAlbumDto): Album {
    const { name, artistId, year } = dto;
    const id = randomUUID();

    const album: Album = {
      id,
      name,
      artistId,
      year,
    };

    this.albums.push(album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    const { name, artistId, year } = dto;

    const albumId = this.albums.findIndex((item) => item.id === id);
    if (albumId === -1) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    const album = this.albums[albumId];

    const updatedAlbum: Album = {
      id: album.id,
      name: name,
      artistId: artistId || album.artistId,
      year,
    };

    this.albums[albumId] = updatedAlbum;

    return updatedAlbum;
  }

  delete(id: string) {
    const albumId = this.albums.findIndex((item) => item.id === id);
    if (albumId === -1) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    this.trackService.setAlbumToNull(id);

    this.albums.splice(albumId, 1);
  }

  setArtistToNull(artistId: string) {
    this.albums.forEach((item) => {
      if (item.artistId === artistId) {
        item.artistId = null;
      }
    });
  }
}
