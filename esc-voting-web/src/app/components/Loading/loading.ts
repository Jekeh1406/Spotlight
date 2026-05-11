import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class LoadingComponent {
  @Input() message = 'Chargement...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() inline = false;
}
