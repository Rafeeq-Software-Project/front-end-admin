import { Injectable, signal } from '@angular/core';

export type DashboardView = 'overview' | 'pending' | 'drafts';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  currentView = signal<DashboardView>('overview');

  setView(view: DashboardView) {
    this.currentView.set(view);
  }
}
