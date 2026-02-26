import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sponsor, SponsorDashboard } from './models/sponsor.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private apiUrl = environment.sponsorApiUrl;

  constructor(private http: HttpClient) {}

  getAllSponsors(): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(this.apiUrl);
  }

  getSponsorById(id: number): Observable<Sponsor> {
    return this.http.get<Sponsor>(`${this.apiUrl}/${id}`);
  }

  getSponsorByEmail(email: string): Observable<Sponsor> {
    return this.http.get<Sponsor>(`${this.apiUrl}/by-email?email=${encodeURIComponent(email)}`);
  }

  getSponsorDashboard(id: number): Observable<SponsorDashboard> {
    return this.http.get<SponsorDashboard>(`${this.apiUrl}/${id}/dashboard`);
  }

  createSponsor(sponsor: Sponsor): Observable<Sponsor> {
    return this.http.post<Sponsor>(this.apiUrl, sponsor);
  }

  updateSponsor(id: number, sponsor: Sponsor): Observable<Sponsor> {
    return this.http.put<Sponsor>(`${this.apiUrl}/${id}`, sponsor);
  }

  deleteSponsor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

