import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {SongVotesResponse, SongVoteDetail} from '../../../interface/group';
import {LoadingComponent} from '../../Loading/loading';

@Component({
  selector: 'app-song-votes-modal',
  imports: [DecimalPipe, LoadingComponent],
  templateUrl: './song-votes-modal.html',
  styleUrl: './song-votes-modal.css',
})
export class SongVotesModalComponent {
  @Input() isOpen = false;
  @Input() data: SongVotesResponse | null = null;
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    this.onClose();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }

  getTotalScore(vote: SongVoteDetail): number {
    return vote.noteVoix + vote.noteMusique + vote.noteInterpretation + vote.noteMiseEnScene;
  }
}
