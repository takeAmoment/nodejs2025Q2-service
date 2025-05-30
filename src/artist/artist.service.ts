import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Artist } from './atrist.interface';
import { CreateArtistDto } from './dto/createArtist.dto';
import { ErorrMessagesEnum } from 'src/constants';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [];

  constructor(private readonly trackService: TrackService) {}

  findAll(): Artist[] {
    return this.artists;
  }

  findById(id: string): Artist {
    const artist = this.artists.find((item) => item.id === id);

    if (!artist) {
      throw new NotFoundException(ErorrMessagesEnum.ARTIST_NOT_EXIST);
    }

    return artist;
  }

  create(dto: CreateArtistDto): Artist {
    const { name, grammy } = dto;
    const id = randomUUID();

    const newArtist: Artist = {
      id,
      name,
      grammy,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, dto: UpdateArtistDto): Artist {
    const { grammy, name } = dto;
    const artistIndex = this.artists.findIndex((item) => item.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(ErorrMessagesEnum.ARTIST_NOT_EXIST);
    }
    const artist = this.artists[artistIndex];

    const updatedArtist: Artist = {
      id: artist.id,
      name,
      grammy,
    };

    this.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  delete(id: string) {
    const artistId = this.artists.findIndex((item) => item.id === id);
    const artist = this.artists[artistId];
    if (artistId === -1) {
      throw new NotFoundException(ErorrMessagesEnum.ARTIST_NOT_EXIST);
    }

    this.trackService.setArtistToNull(artist.id);

    this.artists.splice(artistId, 1);
  }
}
