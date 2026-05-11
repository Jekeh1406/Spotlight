import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../interface/song';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSongs(): Observable<Song[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Song[]>(`${this.apiUrl}/songs`, { headers });
  }
}
