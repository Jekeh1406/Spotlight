import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Song} from '../../../interface/song';
import {CountryFlagPipe} from '../../../pipes/country-flag.pipe';

@Component({
  selector: 'app-song-row',
  imports: [CountryFlagPipe],
  templateUrl: './song-row.html',
  styleUrl: './song-row.scss',
})
export class SongRow {
  @Input() song!: Song;
  @Input() isVoted: boolean = false;
  @Output() songClick = new EventEmitter<Song>();

  onRowClick(): void {
    this.songClick.emit(this.song);
  }
}
