import { Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { TaskModelComponent } from './components/task-model/task-model.component';

export const boardRoutes: Routes = [
  {
    path: '',
    component: BoardComponent,
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModelComponent,
      },
    ],
  },
];
