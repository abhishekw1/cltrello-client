import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/services/authGuard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'boards',
    loadChildren: () =>
      import('./boards/boards.routes').then((m) => m.boardsRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'boards/:boardId',
    loadChildren: () =>
      import('./board/board.routes').then((m) => m.boardRoutes),
    canActivate: [authGuard],
  },
];
