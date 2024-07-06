import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cltrello';

  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
      },
      error: (error) => {
        console.log(error);
        this.authService.setCurrentUser(null);
      },
    });
  }
}
