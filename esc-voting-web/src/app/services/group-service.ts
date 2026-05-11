import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CreateGroupRequest,
  Group,
  GroupRanking,
  GroupStatistics,
  JoinGroupRequest,
  SongVotesResponse
} from '../interface/group';
import {AuthService} from './auth-service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups`, {headers: this.getHeaders()});
  }

  getGroup(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/groups/${groupId}`, {headers: this.getHeaders()});
  }

  createGroup(request: CreateGroupRequest): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups`, request, {headers: this.getHeaders()});
  }

  joinGroup(request: JoinGroupRequest): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups/join`, request, {headers: this.getHeaders()});
  }

  leaveGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${groupId}/leave`, {headers: this.getHeaders()});
  }

  removeMember(groupId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${groupId}/members/${userId}`, {headers: this.getHeaders()});
  }

  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${groupId}`, {headers: this.getHeaders()});
  }

  getGroupRanking(groupId: number): Observable<GroupRanking[]> {
    return this.http.get<GroupRanking[]>(`${this.apiUrl}/groups/${groupId}/ranking`, {headers: this.getHeaders()});
  }

  getGroupStatistics(groupId: number): Observable<GroupStatistics> {
    return this.http.get<GroupStatistics>(`${this.apiUrl}/groups/${groupId}/stats`, {headers: this.getHeaders()});
  }

  getSongVotes(groupId: number, songId: number): Observable<SongVotesResponse> {
    return this.http.get<SongVotesResponse>(`${this.apiUrl}/groups/${groupId}/songs/${songId}/votes`, {headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
