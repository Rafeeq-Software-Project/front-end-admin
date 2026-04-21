import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'Draft' | 'Approved' | 'Rejected';
  createdAt: string;
  creatorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/Admin/Projects`;

  constructor(private http: HttpClient) { }

  getPendingProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/Pending`);
  }

  getDraftProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/Draft`);
  }

  approveProject(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/Approve`, {});
  }

  rejectProject(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/Reject`, {});
  }
}
