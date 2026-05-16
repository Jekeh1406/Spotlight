import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {GroupRanking} from '../../../interface/group';
import {CountryFlagPipe} from '../../../pipes/country-flag.pipe';

@Component({
  selector: 'app-group-results-tab',
  imports: [DecimalPipe, CountryFlagPipe],
  templateUrl: './group-results-tab.html',
  styleUrl: './group-results-tab.css',
})
export class GroupResultsTabComponent {
  @Output() songClick = new EventEmitter<number>();

  rankingData = signal<GroupRanking[]>([]);

  @Input() set ranking(value: GroupRanking[]) {
    this.rankingData.set(value);
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  }

  onSongClick(songId: number): void {
    this.songClick.emit(songId);
  }
}
