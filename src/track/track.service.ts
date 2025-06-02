import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Track } from './track.interface';
import { CreateTrackDto } from './dto/createTrack.dto';
import { ErorrMessagesEnum } from 'src/constants';
import { UpdateTrackDto } from './dto/updateTrack.dto';

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findAllByIds(ids: string[]): Track[] {
    return this.tracks.filter((track) => ids.includes(track.id));
  }

  findById(id: string) {
    const track = this.tracks.find((item) => item.id === id);

    if (!track) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    return track;
  }

  create(dto: CreateTrackDto): Track {
    const { artistId, albumId, duration, name } = dto;
    const id = randomUUID();

    const track: Track = {
      id,
      name,
      artistId,
      albumId,
      duration,
    };

    this.tracks.push(track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto) {
    const { name, albumId, artistId, duration } = dto;

    const trackId = this.tracks.findIndex((item) => item.id === id);
    if (trackId === -1) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    const track = this.tracks[trackId];

    const updatedTrack: Track = {
      id: track.id,
      name: name,
      albumId: albumId || track.albumId,
      artistId: artistId || track.artistId,
      duration: duration,
    };

    this.tracks[trackId] = updatedTrack;

    return updatedTrack;
  }

  delete(id: string) {
    const trackId = this.tracks.findIndex((item) => item.id === id);
    if (trackId === -1) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    this.tracks.splice(trackId, 1);
  }

  setArtistToNull(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  setAlbumToNull(albumId: string) {
    this.tracks.forEach((item) => {
      if (item.albumId === albumId) {
        item.albumId = null;
      }
    });
  }
}
