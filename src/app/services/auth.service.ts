import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://52.3.36.40:8081';

  // Single source of truth for token
  private tokenSignal = signal<string | null>(localStorage.getItem('jwtToken'));

  constructor(private http: HttpClient) {
    this.validateTokenOnStartup();
  }

  // -------- API Calls ----------
 login(credentials: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/login`, credentials);
}

  // -------- Token Handling ----------
  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
    this.tokenSignal.set(token);
  }

  getToken(): string | null {
    const token = this.tokenSignal();
    if (this.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.tokenSignal.set(null);
  }

  isLoggedIn(): boolean {
    const token = this.tokenSignal();
    return !this.isTokenExpired(token);
  }

  // -------- Token Validation ----------
  private validateTokenOnStartup() {
    const token = this.tokenSignal();
    if (this.isTokenExpired(token)) {
      this.logout();
    }
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // exp is in seconds, convert to ms

      return Date.now() > expiry;
    } catch (e) {
      // If decoding fails → treat token as invalid
      return true;
    }
  }
}
