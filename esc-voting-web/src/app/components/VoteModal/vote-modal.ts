import {Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Song, SongVote} from '../../interface/song';
import {VoteRequest} from '../../interface/vote';
import {VoteService} from '../../services/vote-service';
import {VoteCriterionComponent} from '../VoteCriterion/vote-criterion';
import {CountryFlagPipe} from '../../pipes/country-flag.pipe';

interface VoteValues {
  voice: number;
  music: number;
  staging: number;
  performance: number;
}

@Component({
  selector: 'app-vote-modal',
  standalone: true,
  imports: [VoteCriterionComponent, CountryFlagPipe, ReactiveFormsModule],
  templateUrl: './vote-modal.html',
  styleUrl: './vote-modal.css',
})
export class VoteModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() song: Song | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() voteSubmitted = new EventEmitter<SongVote>();

  existingVote = signal<SongVote | null>(null);
  isSubmitting = signal(false);
  hasChanges = signal(false);

  voteForm: FormGroup;
  private initialValues: VoteValues = {voice: 0, music: 0, staging: 0, performance: 0};

  constructor(
    private voteService: VoteService,
    private fb: FormBuilder
  ) {
    this.voteForm = this.fb.group({
      voice: new FormControl(0, [Validators.min(0), Validators.max(5), Validators.required]),
      music: new FormControl(0, [Validators.min(0), Validators.max(5), Validators.required]),
      staging: new FormControl(0, [Validators.min(0), Validators.max(5), Validators.required]),
      performance: new FormControl(0, [Validators.min(0), Validators.max(5), Validators.required])
    });

    this.voteForm.valueChanges.subscribe(() => {
      this.checkForChanges();
    });
  }

  get currentVote(): VoteValues {
    return this.voteForm.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['song'] && this.song) {
      this.initializeVote();
    }
    if (changes['isOpen'] && this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  onCriterionChange(criterion: keyof VoteValues, value: number): void {
    this.voteForm.patchValue({[criterion]: value});
  }

  close(): void {
    document.body.style.overflow = 'auto';
    this.closeModal.emit();
  }

  onBackdropClick(): void {
    this.close();
  }

  submitVote(): void {
    if (!this.song) return;

    const values = this.voteForm.value as VoteValues;
    const voteRequest: VoteRequest = {
      songId: this.song.id,
      noteVoix: values.voice,
      noteMusique: values.music,
      noteMiseEnScene: values.staging,
      noteInterpretation: values.performance
    };

    this.isSubmitting.set(true);

    if (this.existingVote()) {
      this.voteService.updateVote(this.existingVote()!.id, voteRequest).subscribe({
        next: (updatedVote) => {
          this.isSubmitting.set(false);
          this.voteSubmitted.emit(updatedVote);
          this.close();
        },
        error: (err) => {
          console.error('Erreur lors de la modification du vote:', err);
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.voteService.createVote(voteRequest).subscribe({
        next: (newVote) => {
          this.isSubmitting.set(false);
          this.voteSubmitted.emit(newVote);
          this.close();
        },
        error: (err) => {
          console.error('Erreur lors de l\'enregistrement du vote:', err);
          this.isSubmitting.set(false);
        }
      });
    }
  }

  canSubmit(): boolean {
    if (this.existingVote()) {
      return this.hasChanges() && !this.isSubmitting();
    }
    return !this.isSubmitting();
  }

  private initializeVote(): void {
    if (this.song?.userVote) {
      this.existingVote.set(this.song.userVote);
      this.initialValues = {
        voice: this.song.userVote.noteVoix,
        music: this.song.userVote.noteMusique,
        staging: this.song.userVote.noteMiseEnScene,
        performance: this.song.userVote.noteInterpretation
      };
    } else {
      this.existingVote.set(null);
      this.initialValues = {voice: 0, music: 0, staging: 0, performance: 0};
    }

    this.voteForm.setValue(this.initialValues, {emitEvent: false});
    this.hasChanges.set(false);
  }

  private checkForChanges(): void {
    const current = this.voteForm.value as VoteValues;
    const changed =
      current.voice !== this.initialValues.voice ||
      current.music !== this.initialValues.music ||
      current.staging !== this.initialValues.staging ||
      current.performance !== this.initialValues.performance;
    this.hasChanges.set(changed);
  }
}
