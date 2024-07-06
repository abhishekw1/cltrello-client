import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUserInterface } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RegisterRequestInterface } from '../types/registerRequest.interface';
import { LoginRequestInterface } from '../types/loginRequest.interface';
import { SocketService } from '../../shared/services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(
    undefined
  );

  currentUserObservable$ = this.currentUser$.asObservable();

  isLogged$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    // map((currentUser) => Boolean(currentUser))
    map(Boolean)
  );

  constructor(private socketService: SocketService) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + `/user`;
    return this.http.get<CurrentUserInterface>(url);
  }

  login(
    registerRequest: LoginRequestInterface
  ): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + `/users/login`;
    return this.http.post<CurrentUserInterface>(url, registerRequest);
  }

  register(
    registerRequest: RegisterRequestInterface
  ): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + `/users`;
    return this.http.post<CurrentUserInterface>(url, registerRequest);
  }

  setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token);
  }

  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }
  logout(): void {
    this.socketService.disconnect();
    this.currentUser$.next(null);
    localStorage.removeItem('token');
  }
}
