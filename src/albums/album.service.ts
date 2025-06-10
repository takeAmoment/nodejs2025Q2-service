import { Injectable, NotFoundException } from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { CreateAlbumDto } from './dto/createAlbum.dto';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.prismaService.album.findMany();
  }

  async findAllByIds(ids: string[]): Promise<Album[]> {
    return this.prismaService.album.findMany({ where: { id: { in: ids } } });
  }

  async findById(id: string): Promise<Album> {
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException(ErorrMessagesEnum.ALBUM_NOT_EXIST);
    }

    return album;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    const { name, year, artistId } = dto;

    return this.prismaService.album.create({
      data: {
        name,
        year,
        artist: artistId ? { connect: { id: artistId } } : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const { name, artistId, year } = dto;

    await this.findById(id);

    return this.prismaService.album.update({
      where: { id },
      data: {
        name,
        year,
        artist: artistId ? { connect: { id: artistId } } : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    const isInFavs = await this.favoritesService.checkIsAlbumExistInFavs(id);
    if (isInFavs) await this.favoritesService.deleteAlbumFromFavorites(id);

    await this.prismaService.album.delete({ where: { id } });
  }
}
