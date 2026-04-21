import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project, DraftProject } from '../../services/project.service';
import { DashboardService, DashboardView } from '../../services/dashboard.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ProjectDetailsComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  public dashboardService = inject(DashboardService);
  private projectService = inject(ProjectService);

  currentView = this.dashboardService.currentView;
  pendingProjects = signal<Project[]>([]);
  draftProjects = signal<DraftProject[]>([]);

  isLoading = signal(false);
  selectedItem = signal<Project | DraftProject | null>(null);

  constructor() {
    // React to view changes and load data
    effect(() => {
      const view = this.currentView();
      if (view === 'pending') {
        this.loadPendingProjects();
      } else if (view === 'drafts') {
        this.loadDraftProjects();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Initial load for overview stats
    this.loadPendingProjects();
    this.loadDraftProjects();
  }

  loadPendingProjects() {
    this.isLoading.set(this.currentView() === 'pending');
    this.projectService.getPendingProjects().pipe(
      catchError(() => {
        console.warn('Using mock data for Pending Projects');
        return of(this.getMockPending());
      })
    ).subscribe({
      next: (res) => {
        this.pendingProjects.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadDraftProjects() {
    this.isLoading.set(this.currentView() === 'drafts');
    this.projectService.getDraftProjects().pipe(
      catchError(() => {
        console.warn('Using mock data for Draft Projects');
        return of(this.getMockDrafts());
      })
    ).subscribe({
      next: (res) => {
        this.draftProjects.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onViewDetail(item: Project | DraftProject) {
    this.selectedItem.set(item);
  }

  onCloseDetails() {
    this.selectedItem.set(null);
  }

  onApproveProject(id: number) {
    this.projectService.approveProject(id).subscribe({
      next: () => {
        this.loadPendingProjects();
        this.onCloseDetails();
      },
      error: () => this.onCloseDetails() // In a real app, show error toast
    });
  }

  onRejectProject(id: number) {
    this.projectService.rejectProject(id).subscribe({
      next: () => {
        this.loadPendingProjects();
        this.onCloseDetails();
      },
      error: () => this.onCloseDetails()
    });
  }

  onApproveDraft(id: number) {
    this.projectService.approveDraft(id).subscribe({
      next: () => {
        this.loadDraftProjects();
        this.onCloseDetails();
      },
      error: () => this.onCloseDetails()
    });
  }

  onRejectDraft(id: number) {
    this.projectService.rejectDraft(id).subscribe({
      next: () => {
        this.loadDraftProjects();
        this.onCloseDetails();
      },
      error: () => this.onCloseDetails()
    });
  }

  // Type guard to check if item is a Project (not a Draft)
  isProject(item: Project | DraftProject): item is Project {
    return (item as any).liveProject === undefined;
  }

  // Type guard to check if item is a Draft
  isDraft(item: Project | DraftProject): item is DraftProject {
    return (item as any).liveProject !== undefined;
  }

  private getMockPending(): Project[] {
    return [
      {
        id: 1,
        founderId: 101,
        name: 'Eco-Friendly Housing',
        description: 'Building sustainable homes with recycled materials.',
        category: 'Construction',
        status: 'Pending',
        fundingGoal: 500000,
        useOfFunds: 'Material procurement and land acquisition',
        startDate: '2024-06-01',
        endDate: '2024-12-01',
        createdAt: new Date().toISOString(),
        founderName: 'Ahmed Mansour',
        founderCompany: 'GreenFuture Ltd',
        founderProfilePicture: 'https://ui-avatars.com/api/?name=Ahmed+Mansour'
      }
    ];
  }

  private getMockDrafts(): DraftProject[] {
    return [
      {
        id: 1,
        projectId: 10,
        founderId: 102,
        name: 'Updated Smart Agriculture',
        description: 'New AI features for irrigation management.',
        category: 'AgriTech',
        fundingGoal: 250000,
        status: 'Draft',
        founderName: 'Sara Kamel',
        founderCompany: 'AgriSmart',
        liveProject: {
          id: 10,
          founderId: 102,
          name: 'Smart Agriculture',
          description: 'Basic automated irrigation system.',
          category: 'AgriTech',
          status: 'Approved',
          fundingGoal: 150000,
          useOfFunds: 'Hardware development',
          startDate: '2023-01-01',
          endDate: '2023-08-01',
          createdAt: '2022-12-01T10:00:00Z',
          founderName: 'Sara Kamel',
          founderCompany: 'AgriSmart',
          founderProfilePicture: 'https://ui-avatars.com/api/?name=Sara+Kamel'
        }
      }
    ];
  }
}

