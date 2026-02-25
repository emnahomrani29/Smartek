import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterRequest {
  firstName: string;
  email: string;
  password: string;
  phone?: string;
  imageBase64?: string;
  experience?: number;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  role: string;
  imageBase64?: string;
  experience?: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  // BehaviourSubject holds current authentication state so other components can
  // react instantly (header, guards, etc.). Initialized with current token
  // presence so reloads still show correct UI.
  private authStatusSubject = new BehaviorSubject<boolean>(!!this.getToken());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveUserInfo(response);
        this.authStatusSubject.next(true);
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveUserInfo(response);
        this.authStatusSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    this.authStatusSubject.next(false);
    this.router.navigate(['/']);
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private saveUserInfo(userInfo: AuthResponse): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserInfo(): AuthResponse | null {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return null;
    
    try {
      const parsed = JSON.parse(userInfo);
      // S'assurer que experience existe, sinon mettre 0 par défaut
      if (parsed && typeof parsed.experience === 'undefined') {
        parsed.experience = 0;
      }
      return parsed;
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo?.role || null;
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  getRoleDashboardPath(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'ADMIN':
        return '/admin/users';
      case 'LEARNER':
        return '/learner/courses';
      case 'TRAINER':
        return '/trainer/courses';
      case 'RH_SMARTEK':
        return '/rh-smartek/certifications';
      case 'RH_COMPANY':
        return '/rh-company/offers';
      case 'PARTNER':
        return '/partner/sponsorship';
      default:
        return '/dashboard';
    }
  }

  validateUser(): Observable<boolean> {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      return of(false);
    }

    // Appeler le backend pour vérifier si l'utilisateur existe toujours
    return this.http.get<any>(`${this.apiUrl}/validate/${userInfo.userId}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  fetchUserData(): Observable<AuthResponse> {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      return of({} as AuthResponse);
    }

    return this.http.get<AuthResponse>(`${this.apiUrl}/user/${userInfo.userId}`).pipe(
      tap(response => {
        // Mettre à jour les données dans le localStorage
        this.saveUserInfo(response);
      })
    );
  }
}
