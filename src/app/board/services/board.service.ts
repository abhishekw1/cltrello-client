import { SocketService } from './../../shared/services/socket.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardInterface } from '../../shared/types/board.interface';
import { SocketEventsEnum } from '../../shared/types/socketEvent.enum';
import { ColumnInterface } from '../../shared/types/column.interface';
import { TaskInterface } from '../../shared/types/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }

  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }

  addColumn(column: ColumnInterface): void {
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }

  setTasks(tasks: TaskInterface[]) {
    this.tasks$.next(tasks);
  }

  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTasks);
  }

  leaveBoard(boardId: string | null): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }

  updateBoard(updatedBoard: BoardInterface): void {
    const board = this.board$.getValue();
    if (!board) {
      throw new Error('Board is not initialized');
    }
    this.board$.next({ ...board, title: updatedBoard.title });
  }

  updateColumn(updatedColumn: ColumnInterface): void {
    const updatedColumns = this.columns$.getValue().map((column) => {
      if (column.id === updatedColumn.id) {
        return { ...column, title: updatedColumn.title };
      }
      return column;
    });
    this.columns$.next(updatedColumns);
  }

  updateTask(updatedTask: TaskInterface): void {
    const updatedTasks = this.tasks$.getValue().map((task) => {
      if (task.id === updatedTask.id) {
        return {
          ...task,
          title: updatedTask.title,
          description: updatedTask.description,
          columnId: updatedTask.columnId,
        };
      }
      return task;
    });
    this.tasks$.next(updatedTasks);
  }

  deleteColumn(columnId: string | null) {
    const updatedColumn = this.columns$
      .getValue()
      .filter((column) => column.id !== columnId);
    this.columns$.next([...updatedColumn]);
  }
  deleteTask(taskId: string | null) {
    const updatedTasks = this.tasks$
      .getValue()
      .filter((task) => task.id !== taskId);
    this.tasks$.next([...updatedTasks]);
  }
}
