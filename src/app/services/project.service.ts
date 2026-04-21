import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  founderId: number;
  name: string;
  description: string;
  category: string;
  status: string;
  fundingGoal: number;
  useOfFunds: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  founderName: string;
  founderCompany: string;
  founderProfilePicture: string;
}

export interface DraftProject {
  id: number;
  projectId: number;
  founderId: number;
  name: string;
  description: string;
  category: string;
  fundingGoal: number;
  status: string;
  founderName: string;
  founderCompany: string;
  liveProject: Project | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  getPendingProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/pending`);
  }

  getDraftProjects(): Observable<DraftProject[]> {
    return this.http.get<DraftProject[]>(`${this.apiUrl}/drafts/pending`);
  }

  approveProject(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${id}/approve`, {});
  }

  rejectProject(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${id}/reject`, {});
  }

  approveDraft(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/drafts/${id}/approve`, {});
  }

  rejectDraft(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/drafts/${id}/reject`, {});
  }
}

