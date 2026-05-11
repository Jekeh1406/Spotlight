import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {Group, GroupMember, GroupRanking, GroupStatistics} from '../../../interface/group';
import {LoadingComponent} from '../../Loading/loading';
import {GroupResultsTabComponent} from '../GroupResultsTab/group-results-tab';
import {GroupStatsTabComponent} from '../GroupStatsTab/group-stats-tab';

type DetailTab = 'results' | 'stats';

@Component({
  selector: 'app-group-detail-modal',
  imports: [LoadingComponent, GroupResultsTabComponent, GroupStatsTabComponent],
  templateUrl: './group-detail-modal.html',
  styleUrl: './group-detail-modal.css',
})
export class GroupDetailModalComponent {
  @Input() isOpen = false;
  @Input() group: Group | null = null;
  @Input() ranking: GroupRanking[] = [];
  @Input() stats: GroupStatistics | null = null;
  @Input() isLoading = false;
  @Input() isCurrentUserOwner = false;

  @Output() close = new EventEmitter<void>();
  @Output() leave = new EventEmitter<Group>();
  @Output() copyCode = new EventEmitter<string>();
  @Output() removeMember = new EventEmitter<{group: Group, member: GroupMember}>();
  @Output() songClick = new EventEmitter<number>();

  activeTab = signal<DetailTab>('results');

  setTab(tab: DetailTab): void {
    this.activeTab.set(tab);
  }

  onClose(): void {
    this.activeTab.set('results');
    this.close.emit();
  }

  onBackdropClick(): void {
    this.onClose();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }

  onCopyCode(code: string, event: Event): void {
    event.stopPropagation();
    this.copyCode.emit(code);
  }

  onLeave(group: Group): void {
    this.leave.emit(group);
  }

  onRemoveMember(group: Group, member: GroupMember, event: Event): void {
    event.stopPropagation();
    this.removeMember.emit({group, member});
  }

  onSongClick(songId: number): void {
    this.songClick.emit(songId);
  }

  getMemberCount(group: Group): number {
    return group.members?.length || 1;
  }
}
