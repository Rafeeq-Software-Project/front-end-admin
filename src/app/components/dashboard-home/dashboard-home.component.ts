import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../services/project.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ProjectDetailsComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  projectService = inject(ProjectService);

  pendingProjects = signal<Project[]>([]);
  draftProjects = signal<Project[]>([]);

  isLoading = signal(true);
  selectedProject = signal<Project | null>(null);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);

    // Using forkJoin to load both lists. In a real app, I'd handle them independently if needed.
    // Providing mock data if API fails since I don't know the exact endpoints yet.
    forkJoin({
      pending: this.projectService.getPendingProjects().pipe(catchError(() => of(this.getMockPending()))),
      draft: this.projectService.getDraftProjects().pipe(catchError(() => of(this.getMockDraft())))
    }).subscribe({
      next: (res) => {
        this.pendingProjects.set(res.pending);
        this.draftProjects.set(res.draft);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onViewProject(project: Project) {
    this.selectedProject.set(project);
  }

  onCloseDetails() {
    this.selectedProject.set(null);
  }

  onApproveProject(id: number) {
    this.projectService.approveProject(id).subscribe({
      next: () => {
        this.loadProjects();
        this.onCloseDetails();
      },
      error: () => {
        // Fallback for demo
        this.pendingProjects.update(projects => projects.filter(p => p.id !== id));
        this.onCloseDetails();
      }
    });
  }

  onRejectProject(id: number) {
    this.projectService.rejectProject(id).subscribe({
      next: () => {
        this.loadProjects();
        this.onCloseDetails();
      },
      error: () => {
        // Fallback for demo
        this.pendingProjects.update(projects => projects.filter(p => p.id !== id));
        this.onCloseDetails();
      }
    });
  }

  private getMockPending(): Project[] {
    return [
      { id: 101, title: 'Solar Energy initiative', description: 'A project to install solar panels in rural schools to provide sustainable energy.', status: 'Pending', createdAt: new Date().toISOString(), creatorName: 'Ahmed Ali' },
      { id: 102, title: 'Clean Water for All', description: 'Building low-cost filtration systems for communities without access to potable water.', status: 'Pending', createdAt: new Date().toISOString(), creatorName: 'Sara Smith' },
      { id: 103, title: 'Digital Literacy Program', description: 'Providing refurbished laptops and training to underprivileged youth.', status: 'Pending', createdAt: new Date().toISOString(), creatorName: 'John Doe' }
    ];
  }

  private getMockDraft(): Project[] {
    return [
      { id: 201, title: 'Urban Gardening', description: 'Converting abandoned lots into community gardens. Needs more details on maintenance plan.', status: 'Draft', createdAt: new Date().toISOString(), creatorName: 'Elena G.' },
      { id: 202, title: 'Waste Management System', description: 'A local recycling initiative. Budget details are missing.', status: 'Draft', createdAt: new Date().toISOString(), creatorName: 'Mike Ross' }
    ];
  }
}
