import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequestInterface } from '../../types/loginRequest.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { LogoComponent } from '../../../shared/components/logo.comonent';
import { SocketService } from '../../../shared/services/socket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorMsg: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.authService
        .login(this.form.value as LoginRequestInterface)
        .subscribe({
          next: (currentUser) => {
            this.authService.setToken(currentUser);
            this.authService.setCurrentUser(currentUser);
            this.socketService.setupSocketConnection(currentUser);
            this.errorMsg = null;
            this.router.navigateByUrl('/boards');
          },
          error: (err: HttpErrorResponse) => {
            console.log('err', err.error.emailOrPassword);
            this.errorMsg = err.error.emailOrPassword;
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
