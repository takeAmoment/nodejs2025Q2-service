import { Injectable, NotFoundException } from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { Track } from '@prisma/client';
import { FavoritesService } from 'src/favorites/favorites.service';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import { CreateTrackDto } from './dto/createTrack.dto';

@Injectable()
export class TrackService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.prismaService.track.findMany();
  }

  async findAllByIds(ids: string[]): Promise<Track[]> {
    return this.prismaService.track.findMany({ where: { id: { in: ids } } });
  }

  async findById(id: string) {
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException(ErorrMessagesEnum.TRACK_NOT_FOUND);
    }

    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    const { artistId, albumId, duration, name } = dto;

    return this.prismaService.track.create({
      data: {
        name,
        duration,
        artist: artistId ? { connect: { id: artistId } } : undefined,
        album: albumId ? { connect: { id: albumId } } : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateTrackDto) {
    const { name, albumId, artistId, duration } = dto;

    await this.findById(id);

    return this.prismaService.track.update({
      where: { id },
      data: {
        name,
        duration,
        artist: artistId ? { connect: { id: artistId } } : undefined,
        album: albumId ? { connect: { id: albumId } } : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    const isInFavs = await this.favoritesService.checkIsTrackExistInFavs(id);
    if (isInFavs) await this.favoritesService.deleteTrackFromFavorites(id);

    await this.prismaService.track.delete({ where: { id } });
  }
}
