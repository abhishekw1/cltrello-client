import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnInterface } from '../types/column.interface';
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvent.enum';
import { ColunmInputInterface } from '../types/columnInput.interface';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getColumns(boardId: string | null): Observable<ColumnInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<ColumnInterface[]>(url);
  }
  createColumn(columnInput: ColunmInputInterface): void {
    this.socketService.emit(SocketEventsEnum.columnsCreate, columnInput);
  }

  updateColumn(
    boardId: string | null,
    columnId: string | null,
    feilds: { title: string }
  ) {
    this.socketService.emit(SocketEventsEnum.columnsUpdate, {
      boardId,
      columnId,
      feilds,
    });
  }
  deleteColumn(boardId: string, columnId: string | null) {
    this.socketService.emit(SocketEventsEnum.columnsDelete, {
      boardId,
      columnId,
    });
  }
}
