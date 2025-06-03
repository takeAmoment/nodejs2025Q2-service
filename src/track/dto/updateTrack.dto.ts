import { IsInt, IsString } from 'class-validator';
import { IsUUIDOrNull } from 'src/shared/validators/is-uudi-or-null.validator';

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsUUIDOrNull()
  artistId: string | null;

  @IsUUIDOrNull()
  albumId: string | null;

  @IsInt()
  duration: number;
}
