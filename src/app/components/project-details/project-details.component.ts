import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../services/project.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  @Input({ required: true }) project!: Project;
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<number>();
  @Output() reject = new EventEmitter<number>();

  onApprove() {
    this.approve.emit(this.project.id);
  }

  onReject() {
    this.reject.emit(this.project.id);
  }

  onClose() {
    this.close.emit();
  }
}
