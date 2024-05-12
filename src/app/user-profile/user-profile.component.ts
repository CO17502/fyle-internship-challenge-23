import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
  private routerSubscription: Subscription;

  userData: any;
  repo: any[] = [];
  total_repos = 0;
  pageArr: number[] = [];
  currentPage = 1;
  page_size = 10; //default
  error = '';
  loading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100]; // Maximum page size options

  constructor(
    private apiService: ApiService,
    private route: Location,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trigger re-rendering of component
        this.loadPersistedData();
        this.onRouteChange();
      }
    });
  }

  private fetchRepos() {
    this.apiService
      .getRepositoriesFromUrl(
        this.userData.repos_url,
        this.currentPage,
        this.page_size
      )
      .subscribe({
        next: (repos) => {
          this.repo = [...this.repo, ...repos];
          this.repo = _.unionBy(this.repo, 'id');
          localStorage.setItem('repo', JSON.stringify(this.repo));
          this.calculateTotalPages(this.userData.public_repos);
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    // Unsubscribe from router events to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadPersistedData() {
    const storedUserData = localStorage.getItem('userData');
    const storedRepo = localStorage.getItem('repo');
    if (storedUserData && storedRepo) {
      this.userData = JSON.parse(storedUserData);
      this.repo = JSON.parse(storedRepo);
      this.calculateTotalPages(this.userData.public_repos);
    }
  }

  // Method called when page size is changed
  onPageSizeChange() {
    // Recalculate page array with the new page size
    this.calculateTotalPages(this.userData.public_repos);

    // Check if repositories for the current page size are already loaded
    if (this.repo.length >= this.currentPage * this.page_size) return;
    
    // Otherwise, request more data with the new page size
    this.loading = true;
    this.fetchRepos();
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.onPageSizeChange();
  }

  private calculateTotalPages(total: number) {
    this.pageArr = Array.from(
      { length: Math.ceil(total / this.page_size) },
      (_, i) => i
    );
  }

  private onRouteChange() {
    const username = this.route?.path()?.split('/')[1];
    if (!this.repo.length || this.userData.login !== username) {
      this.userData = null;
      this.repo = [];
      localStorage.clear();
      this.loading = true;
      this.apiService.getUser(username).subscribe({
        next: (value: any) => {
          this.userData = value;
          localStorage.setItem('userData', JSON.stringify(value)); // Persist userData
          this.fetchRepos();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
    }
  }

  // Pagination methods
  nextPage() {
    // Check if userData is defined and contains the public_repos property
    if (this.userData && this.userData.public_repos !== undefined) {
      // Check if repositories for the next page are already loaded
      this.currentPage++;
      if (
        this.repo.length < this.currentPage * this.page_size &&
        this.repo.length !== this.userData.public_repos
      ) {
        this.fetchRepos();
      }
    }
  }
  

  prevPage(): void {
    this.currentPage--;
  }
}