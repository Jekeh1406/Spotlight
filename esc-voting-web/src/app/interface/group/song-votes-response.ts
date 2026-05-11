import {SongVoteDetail} from './song-vote-detail';

export interface SongVotesResponse {
  song: {
    id: number;
    title: string;
    artist: string;
    country: string;
    imageUrl?: string;
  };
  votes: SongVoteDetail[];
  voteCount: number;
}
