import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../interface/user/user';
import {UpdateUserRequest, UpdatePasswordRequest} from '../interface/user/update-user-request';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';

interface ProfileResponse {
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  getFirstName(): string {
    return this.userSubject.value?.firstName || '';
  }

  getUserId(): number | null {
    return this.userSubject.value?.id || null;
  }

  getFullName(): string {
    const user = this.userSubject.value;
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }

  getEmail(): string {
    return this.userSubject.value?.email || '';
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  getInitials() {
    return this.getFirstName().charAt(0);
  }

  updateProfile(data: UpdateUserRequest): Observable<User> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/profile`, data).pipe(
      map(response => response.user),
      tap(user => {
        this.setUser(user);
      })
    );
  }

  updatePassword(data: UpdatePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/profile/password`, data);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userSubject.next(user);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      }
    }
  }
}
