import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jwt-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './jwt-login.html',
  styleUrls: ['./jwt-login.css'],
})
export class JwtLogin {
  loginForm!: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.error.set('Please fill in all required fields correctly');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.auth.login(body).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        this.auth.saveToken(res.jwtToken);
        alert('Login Successful!');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Invalid email or password');
        alert('Invalid Credentials');
      },
    });
  }
}

