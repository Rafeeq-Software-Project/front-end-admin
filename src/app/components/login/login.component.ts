import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  email = 'mosbah@gmail.com';
  password = '123456';
  rememberMe = false;
  showPassword = false;
  
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin-dashboard']);
    }
  }

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onLogin() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    console.log('Attempting login with:', this.email);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }
}
