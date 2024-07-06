import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LogoComponent } from '../shared/components/logo.comonent';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LogoComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);
  isLoggedSubscrition: Subscription | undefined;

  ngOnInit(): void {
    this.isLoggedSubscrition = this.authService.isLogged$.subscribe(
      (isLogged) => {
        if (isLogged) {
          this.router.navigateByUrl('/boards');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.isLoggedSubscrition?.unsubscribe();
  }
}
