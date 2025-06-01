import { Album } from 'src/albums/album.interface';
import { Artist } from 'src/artist/atrist.interface';
import { Track } from 'src/track/track.interface';

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export interface MessageResponse {
  message: string;
}
