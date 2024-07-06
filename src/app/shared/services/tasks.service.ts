import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvent.enum';
import { TaskInterface } from '../types/task.interface';
import { TaskInputInterface } from '../types/taskInput.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getTasks(boardId: string | null): Observable<TaskInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/tasks`;
    return this.http.get<TaskInterface[]>(url);
  }
  createTask(taskInput: TaskInputInterface): void {
    this.socketService.emit(SocketEventsEnum.tasksCreate, taskInput);
  }

  updateTask(
    boardId: string,
    taskId: string,
    fields: { title?: string; description?: string; columnId?: string }
  ): void {
    this.socketService.emit(SocketEventsEnum.tasksUpdate, {
      boardId,
      taskId,
      fields,
    });
  }
  deleteTask(boardId: string, taskId: string): void {
    this.socketService.emit(SocketEventsEnum.tasksDelete, {
      boardId,
      taskId,
    });
  }
}
