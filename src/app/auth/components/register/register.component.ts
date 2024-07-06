import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestInterface } from '../../types/registerRequest.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { LogoComponent } from '../../../shared/components/logo.comonent';
import { SocketService } from '../../../shared/services/socket.service';

@Component({
  selector: 'auth-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [RouterLink, ReactiveFormsModule, NgClass, LogoComponent],
})
export class RegisterComponent {
  errorMsg: string | null = null;
  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get email() {
    return this.form.get('email');
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.authService
        .register(this.form.value as RegisterRequestInterface)
        .subscribe({
          next: (currentUser) => {
            console.log('currentUser', currentUser);
            this.authService.setToken(currentUser);
            this.authService.setCurrentUser(currentUser);
            this.socketService.setupSocketConnection(currentUser);
            this.errorMsg = null;
            this.router.navigateByUrl('/boards');
          },
          error: (err: HttpErrorResponse) => {
            console.log('err', err.error);
            this.errorMsg = err.error.join(', ');
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
