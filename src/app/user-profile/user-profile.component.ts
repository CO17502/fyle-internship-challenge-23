import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
  private routerSubscription: Subscription;
  userData: any;
  repo: any;
  total_repos = 0;
  pageArr: number[] = [];
  currentPage = 1;
  page_size = 10; //default
  error = '';
  loading: boolean = false;
  pageSizeOptions: number[] = [5,10, 25, 50, 100]; // Maximum page size options

  constructor(
    private apiService: ApiService,
    private route: Location,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trigger re-rendering of your component
        this.onRouteChange();
      }
    });
  }

  // Method called when page size is changed
  onPageSizeChange() {
    // Implement your logic here, e.g., fetching data with the new page size
    console.log("Selected page size:", this.page_size);
  }

  ngOnDestroy() {
    // Unsubscribe from router events to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  calculateTotalPages(total: number) {
    this.pageArr = Array.from(
      { length: Math.ceil(total / this.page_size) },
      (_, i) => i
    );
  }

  onRouteChange() {
    this.loading = true;
    const username = this.route.path().split('/')[1];
    this.apiService.getUser(username).subscribe({
      next: (value: any) => {
        this.userData = value;
        this.repo = this.apiService
          .getRepositoriesFromUrl(
            value.repos_url,
            this.currentPage,
            this.page_size
          )
          .subscribe({
            next: (repos) => {
              this.repo = repos;
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Error in repo';
              this.loading = false;
            },
          });
        this.calculateTotalPages(value.public_repos);
      },
      error: (err) => {
        this.error = 'Error in user data';
        this.loading = false;
      },
      complete: () => console.log('complete'),
    });
  }
  // Pagination methods
  nextPage() {
    // Check if repositories for the next page are already loaded
    this.currentPage++;
    if (this.repo.length < this.currentPage * this.page_size) {
      this.apiService
        .getRepositoriesFromUrl(
          this.userData.repos_url,
          this.currentPage,
          this.page_size
        )
        .subscribe({
          next: (repos) => {
            console.log('re', this.repo);
            this.repo = [...this.repo, ...repos];
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error in repo';
            this.loading = false;
          },
        });
    }
  }

  prevPage(): void {
    this.currentPage--;
  }
}
