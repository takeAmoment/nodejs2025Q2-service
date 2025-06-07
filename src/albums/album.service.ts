import { Injectable, NotFoundException } from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { Album, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prismaService/prismaService.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prismaService.album.findMany();
  }

  async findAllByIds(ids: string[]): Promise<Album[]> {
    return this.prismaService.album.findMany({ where: { id: { in: ids } } });
  }

  async findById(id: string): Promise<Album> {
    const track = this.prismaService.album.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    return track;
  }

  async create(dto: Prisma.AlbumCreateInput): Promise<Album> {
    const { name, year, artist } = dto;
    return this.prismaService.album.create({
      data: {
        name,
        year,
        artist: artist?.connect
          ? { connect: { id: artist.connect.id } }
          : undefined,
      },
    });
  }

  async update(id: string, dto: Prisma.AlbumUpdateInput): Promise<Album> {
    const { name, artist, year } = dto;

    await this.findById(id);

    return this.prismaService.album.update({
      where: { id },
      data: {
        name,
        year,
        artist: artist?.connect
          ? { connect: { id: artist?.connect.id } }
          : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    this.prismaService.album.delete({ where: { id } });
  }
}
