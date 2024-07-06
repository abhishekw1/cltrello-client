import { AuthService } from './../../../auth/services/auth.service';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo.comonent';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
