import {Injectable} from '@angular/core';
import {LoginRequest} from '../interface/login/login-request';
import {LoginResponse} from '../interface/login/login-response';
import {RegisterRequest} from '../interface/register/register-request';

import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user-service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient,
              private userService: UserService) {
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login_check`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.userService.setUser({
            id: response.user!.id,
            firstName: response.user!.firstName,
            lastName: response.user!.lastName,
            email: response.user!.email
          });
        })
      );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.userService.setUser({
            id: response.user!.id,
            firstName: response.user!.firstName,
            lastName: response.user!.lastName,
            email: response.user!.email
          });
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
  }

}
