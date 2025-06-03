import { IsString, IsInt, IsOptional } from 'class-validator';
import { IsUUIDOrNull } from 'src/shared/validators/is-uudi-or-null.validator';

export class UpdateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsUUIDOrNull()
  @IsOptional()
  artistId: string | null;
}
