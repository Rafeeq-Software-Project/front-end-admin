import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHomeComponent } from "./components/dashboard-home/dashboard-home.component";
import { DashboardLayoutComponent } from "./components/dashboard-layout/dashboard-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardHomeComponent, DashboardLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rafeeq-admin';
}
