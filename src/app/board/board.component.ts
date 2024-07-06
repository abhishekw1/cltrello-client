import { SocketService } from './../shared/services/socket.service';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { BoardsService } from './../shared/services/boards.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from './services/board.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { BoardInterface } from '../shared/types/board.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { SocketEventsEnum } from '../shared/types/socketEvent.enum';
import { ColumnsService } from '../shared/services/columns.service';
import { ColumnInterface } from '../shared/types/column.interface';
import { HeaderComponent } from '../shared/components/header/header.component';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';
import { ColunmInputInterface } from '../shared/types/columnInput.interface';
import { TaskInterface } from '../shared/types/task.interface';
import { TaskInputInterface } from '../shared/types/taskInput.interface';
import { TasksService } from '../shared/services/tasks.service';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  imports: [
    AsyncPipe,
    JsonPipe,
    HeaderComponent,
    InlineFormComponent,
    RouterOutlet,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId!: string | null;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;

  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private boardsService: BoardsService,
    private socketService: SocketService,
    private columnService: ColumnsService,
    private taskService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error(`Can't get boarId form url`);
    }
    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(map(([board, columns, tasks]) => ({ board, columns, tasks })));
  }
  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fecthData();
    this.initializeListners();
  }

  initializeListners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !event.url.includes('/boards/')) {
        console.log('leaving a page');
        this.boardService.leaveBoard(this.boardId);
      }
    });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((task) => {
        this.boardService.addTask(task);
      });
    this.socketService
      .listen<BoardInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((board) => {
        this.boardService.updateBoard(board);
      });
    this.socketService
      .listen<void>(SocketEventsEnum.boardsDeleteSuccess)
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });
    this.socketService
      .listen<string>(SocketEventsEnum.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((updatedColumn) => {
        this.boardService.updateColumn(updatedColumn);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((updatedTask) => {
        this.boardService.updateTask(updatedTask);
      });
    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((deletedTaskId) => {
        this.boardService.deleteTask(deletedTaskId);
      });
  }

  fecthData(): void {
    this.boardsService
      .getBoard(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((board) => {
        this.boardService.setBoard(board);
      });
    this.columnService
      .getColumns(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columns) => {
        this.boardService.setColumns(columns);
      });
    this.taskService
      .getTasks(this.boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tasks) => {
        this.boardService.setTasks(tasks);
      });
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]) {
    return tasks.filter((task) => task.columnId === columnId);
  }
  createColumn(title: string): void {
    const columnInput: ColunmInputInterface = {
      title: title,
      boardId: this.boardId,
    };
    this.columnService.createColumn(columnInput);
  }
  createTask(title: string, columnId: string, userId: string): void {
    const taskInput: TaskInputInterface = {
      title: title,
      boardId: this.boardId,
      columnId,
    };
    this.taskService.createTask(taskInput);
  }

  updateBoardName(boardName: string) {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }

  deleteBoard(boardId: string) {
    if (confirm('Are you sure you want to delete the board?')) {
      this.boardsService.deleteBoard(boardId);
    }
  }
  updateColumnName(columnName: string, columnId: string) {
    this.columnService.updateColumn(this.boardId, columnId, {
      title: columnName,
    });
  }
  deleteColumn(boardId: string, columnId: string) {
    if (confirm('Are you sure you want to delete the column?')) {
      this.columnService.deleteColumn(boardId, columnId);
    }
  }
  openTask(taskId: string) {
    this.router.navigate(['/boards', this.boardId, 'tasks', taskId]);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
