import { Component } from '@angular/core';
import { SessionExpiredService } from '../../services/session-expired.service';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  templateUrl: './session-expired-modal.html',
  styleUrl: './session-expired-modal.css',
})
export class SessionExpiredModalComponent {
  constructor(public sessionExpiredService: SessionExpiredService) {}

  onReconnect(): void {
    this.sessionExpiredService.reconnect();
  }
}
