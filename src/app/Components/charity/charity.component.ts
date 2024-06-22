import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../Services/projectService/project.service';
import { BlankNavbarComponent } from '../blank-navbar/blank-navbar.component';
import { NavWithSearchComponent } from '../nav-with-search/nav-with-search.component';
enum ProjectState {
  Initiated,
  Completed,
  InProgress,
  Paused,
  Canceled
}
@Component({
  selector: 'app-charity',
  standalone: true,
  imports: [CommonModule, RouterModule,NavWithSearchComponent],
  templateUrl: './charity.component.html',
  styleUrl: './charity.component.css'
})
export class CharityComponent {
  projects: any[] = [];
  charityId: number | null = null;
  currentPage: number = 1;
  PagesAvailable: boolean = true;
  constructor(private _projectService:ProjectService, private _route:ActivatedRoute){}

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.charityId = Number(params.get('id')); 
      if (this.charityId !== null) {
        this.getProjects(this.currentPage);
    
      }
    });
    
  }
  getFullImageUrl(relativePath: string): string {
    return `https://localhost:44377${relativePath}`;
  }
  getProjects(page: number): void {
    this._projectService.getProjectsByPage(page).subscribe({
      next: (response) => {
        console.log(response);
        if (response.message.length > 0) {
          this.projects = response.message;
        
          this.PagesAvailable = response.message.length === 3; 
        } else {
          this.PagesAvailable = false;
        }
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  onPageChange(page: number): void {
    if (page > 0) {
      this.currentPage = page;
      this.getProjects(page);
    }
  }
  getStatusString(state: ProjectState): string {
    switch (state) {
      case ProjectState.Initiated:
        return 'Initiated';
      case ProjectState.Completed:
        return 'Completed';
      case ProjectState.InProgress:
        return 'In Progress';
      case ProjectState.Paused:
        return 'Paused';
      case ProjectState.Canceled:
        return 'Canceled';
      default:
        return 'Unknown';
    }
  }
}
