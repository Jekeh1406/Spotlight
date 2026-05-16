export interface GroupRanking {
  rank: number;
  songId: number;
  title: string;
  artist: string;
  country: string;
  flag?: string;
  imageUrl?: string;
  score: number;
  voteCount: number;
}
