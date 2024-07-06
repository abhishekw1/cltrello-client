import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardInterface } from '../types/board.interface';
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvent.enum';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  // all boards

  getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.http.get<BoardInterface[]>(url);
  }

  createBoard(title: string): Observable<BoardInterface> {
    const url = environment.apiUrl + '/boards';
    return this.http.post<BoardInterface>(url, { title });
  }

  // single board
  getBoard(boardId: string | null): Observable<BoardInterface> {
    const url = `${environment.apiUrl}/boards/${boardId}`;
    return this.http.get<BoardInterface>(url);
  }

  updateBoard(boardId: string | null, feilds: { title: string }) {
    this.socketService.emit(SocketEventsEnum.boardsUpdate, { boardId, feilds });
  }

  deleteBoard(boardId: string | null) {
    this.socketService.emit(SocketEventsEnum.boardsDelete, { boardId });
  }
}
