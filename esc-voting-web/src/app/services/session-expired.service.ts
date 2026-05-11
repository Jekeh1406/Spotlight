import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class SessionExpiredService {
  isOpen = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  show(): void {
    this.isOpen.set(true);
  }

  reconnect(): void {
    this.isOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
