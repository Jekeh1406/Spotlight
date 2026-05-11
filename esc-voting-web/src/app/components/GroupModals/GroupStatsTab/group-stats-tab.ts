import {Component, Input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {GroupStatistics} from '../../../interface/group';

@Component({
  selector: 'app-group-stats-tab',
  imports: [DecimalPipe],
  templateUrl: './group-stats-tab.html',
  styleUrl: './group-stats-tab.css',
})
export class GroupStatsTabComponent {
  @Input() stats: GroupStatistics | null = null;
}
