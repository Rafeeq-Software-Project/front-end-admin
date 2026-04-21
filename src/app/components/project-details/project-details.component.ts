import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, DraftProject } from '../../services/project.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  @Input({ required: true }) item!: Project | DraftProject;
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<number>();
  @Output() reject = new EventEmitter<number>();

  isDraft(item: Project | DraftProject): item is DraftProject {
    return (item as any).liveProject !== undefined;
  }

  get project(): Project {
    if (this.isDraft(this.item)) {
      return this.item.liveProject!;
    }
    return this.item as Project;
  }

  get draft(): DraftProject | null {
    return this.isDraft(this.item) ? this.item : null;
  }

  onApprove() {
    this.approve.emit(this.item.id);
  }

  onReject() {
    this.reject.emit(this.item.id);
  }

  onClose() {
    this.close.emit();
  }
}

