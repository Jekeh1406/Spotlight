import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VoteRequest} from '../interface/vote';
import {SongVote} from '../interface/song';
import {AuthService} from './auth-service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  createVote(vote: VoteRequest): Observable<SongVote> {
    return this.http.post<SongVote>(`${this.apiUrl}/votes`, vote, {headers: this.getHeaders()});
  }

  updateVote(voteId: number, vote: VoteRequest): Observable<SongVote> {
    return this.http.patch<SongVote>(`${this.apiUrl}/votes/${voteId}`, vote, {headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
