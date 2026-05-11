import {Country} from '../country/country';
import {SongVote} from './song-vote';

export interface Song {
  id: number;
  title: string;
  artist: string;
  imageUrl?: string;
  country: Country;
  order?: number;
  userVote: SongVote | null;
}
