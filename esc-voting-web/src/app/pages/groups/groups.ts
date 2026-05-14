import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';
import {Group, GroupMember, GroupRanking, GroupStatistics, SongVotesResponse} from '../../interface/group';
import {GroupService} from '../../services/group-service';
import {UserService} from '../../services/user-service';
import {LoadingComponent} from '../../components/Loading/loading';
import {ConfirmModalComponent} from '../../components/ConfirmModal/confirm-modal';
import {GroupDetailModalComponent} from '../../components/GroupModals/GroupDetailModal/group-detail-modal';
import {SongVotesModalComponent} from '../../components/GroupModals/SongVotesModal/song-votes-modal';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-groups',
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
    LoadingComponent,
    ConfirmModalComponent,
    GroupDetailModalComponent,
    SongVotesModalComponent
  ],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups implements OnInit {
  groups = signal<Group[]>([]);
  selectedGroup = signal<Group | null>(null);
  groupRanking = signal<GroupRanking[]>([]);
  groupStats = signal<GroupStatistics | null>(null);

  // Modal states
  isCreateModalOpen = signal(false);
  isJoinModalOpen = signal(false);
  isGroupDetailOpen = signal(false);
  isSongVotesModalOpen = signal(false);

  // Song votes detail
  songVotesData = signal<SongVotesResponse | null>(null);
  isLoadingSongVotes = signal(false);

  // Form inputs
  newGroupName = '';
  joinCode = '';

  // Toast state
  isToastVisible = signal(false);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  // Loading states
  isLoading = signal(false);
  isSubmitting = signal(false);
  isLoadingDetails = signal(false);

  // Confirm modal state
  isConfirmModalOpen = signal(false);
  confirmModalConfig = signal<{
    title: string;
    message: string;
    icon: string;
    type: 'danger' | 'warning' | 'info';
    confirmText: string;
    onConfirm: () => void;
  }>({
    title: '',
    message: '',
    icon: '⚠️',
    type: 'danger',
    confirmText: 'Confirmer',
    onConfirm: () => {
    }
  });

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.isLoading.set(true);
    this.groupService.getMyGroups().subscribe({
      next: (groups) => {
        this.groups.set(groups);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des groupes:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Create group modal
  openCreateModal(): void {
    this.newGroupName = '';
    this.isCreateModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  createGroup(): void {
    if (!this.newGroupName.trim()) return;

    this.isSubmitting.set(true);
    this.groupService.createGroup({name: this.newGroupName.trim()}).subscribe({
      next: (group) => {
        this.groups.set([...this.groups(), group]);
        this.showToast(`Groupe "${group.name}" cree avec succes !`, 'success');
        this.closeCreateModal();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Erreur lors de la creation du groupe:', err);
        this.showToast('Erreur lors de la creation du groupe', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  // Join group modal
  openJoinModal(): void {
    this.joinCode = '';
    this.isJoinModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeJoinModal(): void {
    this.isJoinModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  joinGroup(): void {
    if (!this.joinCode.trim()) return;

    this.isSubmitting.set(true);
    this.groupService.joinGroup({code: this.joinCode.trim().toUpperCase()}).subscribe({
      next: (group) => {
        this.groups.set([...this.groups(), group]);
        this.showToast(`Vous avez rejoint le groupe "${group.name}" !`, 'success');
        this.closeJoinModal();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Erreur lors de la jonction au groupe:', err);
        const message = err.status === 404 ? 'Code invalide' : 'Erreur lors de la jonction au groupe';
        this.showToast(message, 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  // Group detail modal
  openGroupDetail(group: Group): void {
    this.selectedGroup.set(group);
    this.isGroupDetailOpen.set(true);
    document.body.style.overflow = 'hidden';
    this.loadGroupDetails(group.id);
  }

  loadGroupDetails(groupId: number): void {
    this.isLoadingDetails.set(true);
    this.groupRanking.set([]);
    this.groupStats.set(null);

    forkJoin({
      ranking: this.groupService.getGroupRanking(groupId),
      stats: this.groupService.getGroupStatistics(groupId)
    }).subscribe({
      next: ({ranking, stats}) => {
        this.groupRanking.set(ranking);
        this.groupStats.set(stats);
        this.isLoadingDetails.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des details:', err);
        this.isLoadingDetails.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  closeGroupDetail(): void {
    this.isGroupDetailOpen.set(false);
    this.selectedGroup.set(null);
    this.groupRanking.set([]);
    this.groupStats.set(null);
    document.body.style.overflow = 'auto';
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.showToast('Code copie !', 'success');
    });
  }

  leaveGroup(group: Group): void {
    this.showConfirmModal({
      title: 'Quitter le groupe',
      message: `Voulez-vous vraiment quitter le groupe "${group.name}" ?`,
      icon: '🚪',
      type: 'warning',
      confirmText: 'Quitter',
      onConfirm: () => {
        this.groupService.leaveGroup(group.id).subscribe({
          next: () => {
            this.groups.set(this.groups().filter(g => g.id !== group.id));
            this.showToast(`Vous avez quitte le groupe "${group.name}"`, 'success');
            this.closeGroupDetail();
          },
          error: (err) => {
            console.error('Erreur:', err);
            this.showToast('Erreur lors de la sortie du groupe', 'error');
          }
        });
      }
    });
  }

  deleteGroup(group: Group): void {
    this.showConfirmModal({
      title: 'Supprimer le groupe',
      message: `Voulez-vous vraiment supprimer le groupe "${group.name}" ? Cette action est irreversible.`,
      icon: '🗑️',
      type: 'danger',
      confirmText: 'Supprimer',
      onConfirm: () => {
        this.groupService.deleteGroup(group.id).subscribe({
          next: () => {
            this.groups.set(this.groups().filter(g => g.id !== group.id));
            this.showToast(`Groupe "${group.name}" supprime`, 'success');
            this.closeGroupDetail();
          },
          error: (err) => {
            console.error('Erreur:', err);
            this.showToast('Erreur lors de la suppression du groupe', 'error');
          }
        });
      }
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.isToastVisible.set(true);

    setTimeout(() => {
      this.isToastVisible.set(false);
    }, 3000);
  }

  getMemberCount(group: Group): number {
    return group.members?.length || 1;
  }

  // Song votes modal
  openSongVotesModal(songId: number): void {
    const group = this.selectedGroup();
    if (!group) return;

    this.isSongVotesModalOpen.set(true);
    this.loadSongVotes(group.id, songId);
  }

  loadSongVotes(groupId: number, songId: number): void {
    this.isLoadingSongVotes.set(true);
    this.songVotesData.set(null);

    this.groupService.getSongVotes(groupId, songId).subscribe({
      next: (data) => {
        this.songVotesData.set(data);
        this.isLoadingSongVotes.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des votes:', err);
        this.isLoadingSongVotes.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  closeSongVotesModal(): void {
    this.isSongVotesModalOpen.set(false);
    this.songVotesData.set(null);
  }

  isCurrentUserOwner(group: Group): boolean {
    const currentUserId = this.userService.getUserId();
    return currentUserId !== null && Number(group.ownerId) === Number(currentUserId);
  }

  removeMember(group: Group, member: GroupMember): void {
    this.showConfirmModal({
      title: 'Exclure un membre',
      message: `Voulez-vous vraiment exclure ${member.firstName} ${member.lastName} du groupe ?`,
      icon: '👤',
      type: 'danger',
      confirmText: 'Exclure',
      onConfirm: () => {
        this.groupService.removeMember(group.id, member.id).subscribe({
          next: () => {
            const updatedMembers = group.members.filter(m => m.id !== member.id);
            const updatedGroup = {...group, members: updatedMembers};
            this.selectedGroup.set(updatedGroup);
            this.groups.set(this.groups().map(g => g.id === group.id ? updatedGroup : g));
            this.showToast(`${member.firstName} a ete exclu du groupe`, 'success');
          },
          error: (err) => {
            console.error('Erreur lors de l\'exclusion:', err);
            let message = 'Erreur lors de l\'exclusion du membre';
            if (err.status === 403) {
              message = 'Vous n\'etes pas autorise a exclure des membres';
            } else if (err.status === 400) {
              message = err.error?.message || 'Action non autorisee';
            }
            this.showToast(message, 'error');
          }
        });
      }
    });
  }

  onRemoveMember(event: { group: Group, member: GroupMember }): void {
    this.removeMember(event.group, event.member);
  }

  onRenameGroup(event: { group: Group, name: string }): void {
    const {group, name} = event;
    this.groupService.renameGroup(group.id, name).subscribe({
      next: (updatedGroup) => {
        this.groups.set(this.groups().map(g => g.id === updatedGroup.id ? updatedGroup : g));
        this.selectedGroup.set(updatedGroup);
        this.showToast(`Groupe renomme en "${updatedGroup.name}"`, 'success');
      },
      error: (err) => {
        console.error('Erreur lors du renommage:', err);
        this.showToast('Erreur lors du renommage du groupe', 'error');
      }
    });
  }

  // Confirm modal methods
  showConfirmModal(config: {
    title: string;
    message: string;
    icon: string;
    type: 'danger' | 'warning' | 'info';
    confirmText: string;
    onConfirm: () => void;
  }): void {
    this.confirmModalConfig.set(config);
    this.isConfirmModalOpen.set(true);
  }

  onConfirmModalConfirm(): void {
    const config = this.confirmModalConfig();
    this.isConfirmModalOpen.set(false);
    config.onConfirm();
  }

  onConfirmModalCancel(): void {
    this.isConfirmModalOpen.set(false);
  }
}
