import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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

  private pendingProjectsSubject = new BehaviorSubject<Project[]>([]);
  public pendingProjects$ = this.pendingProjectsSubject.asObservable();

  private draftProjectsSubject = new BehaviorSubject<DraftProject[]>([]);
  public draftProjects$ = this.draftProjectsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshPendingProjects();
    this.refreshDraftProjects();
  }

  getPendingProjects(): Observable<Project[]> {
    return this.pendingProjects$;
  }

  getDraftProjects(): Observable<DraftProject[]> {
    return this.draftProjects$;
  }

  refreshPendingProjects(): void {
    this.http.get<Project[]>(`${this.apiUrl}/projects/pending`).subscribe({
      next: (projects) => this.pendingProjectsSubject.next(projects),
      error: (error) => console.error('Error fetching pending projects:', error)
    });
  }

  refreshDraftProjects(): void {
    this.http.get<DraftProject[]>(`${this.apiUrl}/drafts/pending`).subscribe({
      next: (drafts) => this.draftProjectsSubject.next(drafts),
      error: (error) => console.error('Error fetching draft projects:', error)
    });
  }

  approveProject(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${id}/review`, { status: 2 }).pipe(
      tap(() => {
        const current = this.pendingProjectsSubject.value;
        this.pendingProjectsSubject.next(current.filter(p => p.id !== id));
        this.refreshPendingProjects();
      })
    );
  }

  rejectProject(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${id}/review`, {
      status: 3,
      rejectionReason: reason
    }).pipe(
      tap(() => {
        const current = this.pendingProjectsSubject.value;
        this.pendingProjectsSubject.next(current.filter(p => p.id !== id));
        this.refreshPendingProjects();
      })
    );
  }

  approveDraft(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/drafts/${id}/review`, { status: 2 }).pipe(
      tap(() => {
        const current = this.draftProjectsSubject.value;
        this.draftProjectsSubject.next(current.filter(d => d.id !== id));
        this.refreshDraftProjects();
      })
    );
  }

  rejectDraft(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/drafts/${id}/review`, {
      status: 3,
      rejectionReason: reason
    }).pipe(
      tap(() => {
        const current = this.draftProjectsSubject.value;
        this.draftProjectsSubject.next(current.filter(d => d.id !== id));
        this.refreshDraftProjects();
      })
    );
  }
}



