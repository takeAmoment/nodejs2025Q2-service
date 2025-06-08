import { Injectable, NotFoundException } from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { Track, Prisma } from '@prisma/client';
import { FavoritesService } from 'src/favorites/favorites.service';

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

  async create(dto: Prisma.TrackCreateInput): Promise<Track> {
    const { artist, album, duration, name } = dto;

    return this.prismaService.track.create({
      data: {
        name,
        duration,
        artist: artist?.connect
          ? { connect: { id: artist.connect.id } }
          : undefined,
        album: album?.connect
          ? { connect: { id: album.connect.id } }
          : undefined,
      },
    });
  }

  async update(id: string, dto: Prisma.TrackUpdateInput) {
    const { name, album, artist, duration } = dto;

    await this.findById(id);

    return this.prismaService.track.update({
      where: { id },
      data: {
        name,
        duration,
        artist: artist?.connect
          ? { connect: { id: artist.connect.id } }
          : undefined,
        album: album?.connect
          ? { connect: { id: album.connect.id } }
          : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    this.favoritesService.deleteTrackFromFavorites(id);
    this.prismaService.track.delete({ where: { id } });
  }
}
