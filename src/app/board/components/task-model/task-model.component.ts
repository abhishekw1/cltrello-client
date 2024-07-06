import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { TaskInterface } from '../../../shared/types/task.interface';
import { InlineFormComponent } from '../../../shared/components/inline-form/inline-form.component';
import { AsyncPipe } from '@angular/common';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../../../shared/services/tasks.service';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvent.enum';

@Component({
  selector: 'app-task-model',
  standalone: true,
  imports: [InlineFormComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './task-model.component.html',
  styleUrl: './task-model.component.scss',
})
export class TaskModelComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId!: string;
  taskId!: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{
    task: TaskInterface;
    columns: ColumnInterface[];
  }>;

  columnForm = new FormGroup({ columnId: new FormControl('') });

  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private tasksService: TasksService,
    private socketService: SocketService
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error("Can't get boardID from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskID from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      }))
    );
    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (columnId && task.columnId !== columnId) {
          console.log(columnId);
          this.tasksService.updateTask(this.boardId, task.id, { columnId });
        }
      });

    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deletedTaskId) => {
        this.goToBoard();
      });
  }
  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  updateTaskName(taskName: string) {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }
  updateTaskDescription(description: string) {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: description,
    });
  }
  deleteTask() {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
}
