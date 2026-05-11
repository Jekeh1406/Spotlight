import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-vote-criterion',
  standalone: true,
  templateUrl: './vote-criterion.html',
  styleUrl: './vote-criterion.css',
})
export class VoteCriterionComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() value: number = 0;
  @Input() disabled: boolean = false;
  min = 0;
  max = 5;
  step = 0.25;

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    this.valueChange.emit(newValue);
  }
}
