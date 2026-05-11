import {Component, computed, OnInit, signal} from '@angular/core';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';
import {Song, SongVote} from '../../interface/song';
import {SongService} from '../../services/song-service';
import {VoteModalComponent} from '../../components/VoteModal/vote-modal';
import {CountryFlagPipe} from '../../pipes/country-flag.pipe';
import {LoadingComponent} from '../../components/Loading/loading';

interface RankedSong extends Song {
  totalScore: number;
  displayScore: number;
  rank: number;
}

type SortCriteria = 'total' | 'voix' | 'musique' | 'interpretation' | 'miseEnScene';

interface SortOption {
  key: SortCriteria;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-my-tops',
  imports: [
    NavbarComponent,
    FooterComponent,
    VoteModalComponent,
    CountryFlagPipe,
    LoadingComponent
  ],
  templateUrl: './my-tops.html',
  styleUrl: './my-tops.css',
})
export class MyTops implements OnInit {
  songs = signal<Song[]>([]);
  isLoading = signal(false);
  selectedSort = signal<SortCriteria>('total');

  sortOptions: SortOption[] = [
    {key: 'total', label: 'Total', icon: '🏆'},
    {key: 'voix', label: 'Voix', icon: '🎤'},
    {key: 'musique', label: 'Musique', icon: '🎵'},
    {key: 'miseEnScene', label: 'Mise en scene', icon: '🎭'},
    {key: 'interpretation', label: 'Interpretation', icon: '✨'},
  ];

  // Modal state
  isModalOpen = false;
  selectedSong: Song | null = null;

  // Toast state
  isToastVisible = false;
  toastMessage = '';

  rankedSongs = computed(() => {
    const sortCriteria = this.selectedSort();

    const votedSongs = this.songs()
      .filter(song => song.userVote !== null)
      .map(song => {
        const vote = song.userVote!;
        const totalScore = vote.noteVoix + vote.noteMusique + vote.noteInterpretation + vote.noteMiseEnScene;

        let displayScore: number;
        switch (sortCriteria) {
          case 'voix':
            displayScore = vote.noteVoix;
            break;
          case 'musique':
            displayScore = vote.noteMusique;
            break;
          case 'interpretation':
            displayScore = vote.noteInterpretation;
            break;
          case 'miseEnScene':
            displayScore = vote.noteMiseEnScene;
            break;
          default:
            displayScore = totalScore;
        }

        return {
          ...song,
          totalScore,
          displayScore,
          rank: 0
        } as RankedSong;
      })
      .sort((a, b) => b.displayScore - a.displayScore);

    // Calcul du rang avec gestion des égalités
    votedSongs.forEach((song, index) => {
      if (index === 0) {
        song.rank = 1;
      } else if (song.displayScore === votedSongs[index - 1].displayScore) {
        // Même score = même rang
        song.rank = votedSongs[index - 1].rank;
      } else {
        // Score différent = rang = position (crée un saut après égalité)
        song.rank = index + 1;
      }
    });

    return votedSongs;
  });
  unvotedSongs = computed(() => {
    return this.songs().filter(song => song.userVote === null);
  });
  podium = computed(() => {
    const ranked = this.rankedSongs();
    return {
      first: ranked[0] || null,
      second: ranked[1] || null,
      third: ranked[2] || null
    };
  });

  constructor(private songService: SongService) {}

  setSort(criteria: SortCriteria): void {
    this.selectedSort.set(criteria);
  }

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.isLoading.set(true);
    this.songService.getSongs().subscribe({
      next: (songs) => {
        this.songs.set(songs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.isLoading.set(false);
      }
    });
  }

  openModal(song: Song): void {
    this.selectedSong = song;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSong = null;
  }

  onVoteSubmitted(vote: SongVote): void {
    const songs = this.songs();
    const song = songs.find(s => s.id === this.selectedSong?.id);
    if (song) {
      song.userVote = vote;
      this.songs.set([...songs]);
    }
    this.showToast(`Vote enregistre pour ${this.selectedSong?.artist} !`);
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.isToastVisible = true;
    setTimeout(() => {
      this.isToastVisible = false;
    }, 3000);
  }

  getMedal(rank: number): string {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  }
}
