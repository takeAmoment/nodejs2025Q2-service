import { Injectable, NotFoundException } from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { Artist, Prisma } from '@prisma/client';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.prismaService.artist.findMany();
  }

  async findAllByIds(ids: string[]): Promise<Artist[]> {
    return this.prismaService.artist.findMany({ where: { id: { in: ids } } });
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(ErorrMessagesEnum.ARTIST_NOT_EXIST);
    }

    return artist;
  }

  async create(dto: Prisma.ArtistCreateInput): Promise<Artist> {
    return this.prismaService.artist.create({ data: dto });
  }

  async update(id: string, dto: Prisma.ArtistUpdateInput): Promise<Artist> {
    await this.findById(id);
    return this.prismaService.artist.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findById(id);
    const isInFavs = await this.favoritesService.checkIsArtistExistInFavs(id);
    if (isInFavs) await this.favoritesService.deleteArtistFromFavorites(id);

    await this.prismaService.artist.delete({ where: { id } });
  }
}
