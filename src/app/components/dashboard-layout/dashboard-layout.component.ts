import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardView } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  dashboardService = inject(DashboardService);
  
  isSidebarOpen = true;
  isMobileSidebarOpen = signal<boolean>(false);

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isMobileSidebarOpen.set(false);
    }
  }

  get showSidebarLabels() {
    return this.isSidebarOpen || this.isMobileSidebarOpen();
  }

  get currentView() {
    return this.dashboardService.currentView();
  }

  changeView(view: DashboardView) {
    this.dashboardService.setView(view);
    if (window.innerWidth <= 768) {
      this.isMobileSidebarOpen.set(false);
    }
  }

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  toggleSidebar() {
    if (window.innerWidth <= 768) {
      this.isMobileSidebarOpen.update((val: boolean) => !val);
    } else {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }
}
