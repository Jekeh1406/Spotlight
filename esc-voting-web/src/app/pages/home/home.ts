import {Component, OnInit, signal} from '@angular/core';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';
import {Song, SongVote} from '../../interface/song';
import {SongRow} from '../../components/Song/song-row/song-row';
import {SongService} from '../../services/song-service';
import {VoteModalComponent} from '../../components/VoteModal/vote-modal';
import {LoadingComponent} from '../../components/Loading/loading';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    FooterComponent,
    SongRow,
    VoteModalComponent,
    LoadingComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  songs = signal<Song[]>([]);
  isLoading = signal(false);

  // Modal state
  isModalOpen = false;
  selectedSong: Song | null = null;

  // Toast state
  isToastVisible = false;
  toastMessage = '';

  constructor(private songService: SongService) {
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
    const song = this.songs().find(s => s.id === this.selectedSong?.id);
    if (song) {
      song.userVote = vote;
      this.songs.set([...this.songs()]);
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
}
