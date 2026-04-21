import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, DraftProject } from '../../services/project.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project | DraftProject;
  @Output() viewDetails = new EventEmitter<Project | DraftProject>();

  onView() {
    this.viewDetails.emit(this.project);
  }

  isDraft(project: Project | DraftProject): project is DraftProject {
    return (project as any).liveProject !== undefined;
  }

  get displayDate(): string | null {
    if (this.isDraft(this.project)) {
      return this.project.liveProject?.createdAt || null;
    }
    return this.project.createdAt;
  }


}
