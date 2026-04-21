import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Auth`;
  private accessTokenKey = 'rafeeq_admin_access_token';
  private refreshTokenKey = 'rafeeq_admin_refresh_token';

  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(this.checkToken());

  constructor(private http: HttpClient, private router: Router) { }

  private checkToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(this.accessTokenKey);
    }
    return false;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.accessToken) {
          this.setTokens(response.accessToken, response.refreshToken);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.accessTokenKey, accessToken);
      if (refreshToken) {
        localStorage.setItem(this.refreshTokenKey, refreshToken);
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.accessTokenKey);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
