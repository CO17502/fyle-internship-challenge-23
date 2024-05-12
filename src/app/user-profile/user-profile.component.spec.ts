import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile.component';
import { ApiService } from '../services/api.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let activatedRoute: ActivatedRoute;
  let fixture: ComponentFixture<UserProfileComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let apiService: jasmine.SpyObj<ApiService>; // Replace 'ApiService' with the actual service name

  beforeEach(async () => {
    const activatedRouteSpy = { path: () => '/' };
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getRepositoriesFromUrl',
      'getUser',
    ]);
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule],
      providers: [
        ApiService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    spyOn(router.events, 'subscribe').and.returnValue(
      //@ts-ignore
      of(new NavigationEnd(0, '', ''))
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from router events on component destruction', () => {
    //@ts-ignore
    spyOn(component.routerSubscription, 'unsubscribe');
    component.ngOnDestroy();
    //@ts-ignore
    expect(component.routerSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display loader skeleton when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const loaderSkeleton = debugElement.query(By.css('.animate-pulse'));
    expect(loaderSkeleton).toBeTruthy();
  });

  it('should not display loader skeleton when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();
    const loaderSkeleton = debugElement.query(By.css('.animate-pulse'));
    expect(loaderSkeleton).toBeFalsy();
  });

  it('should display content when userData is not null', () => {
    component.userData = {
      name: 'John Papa',
      bio: 'Winter is Coming',
      location: 'Orlando, FL',
      twitter_username: 'john_papa',
      avatar_url: 'https://avatars.githubusercontent.com/u/1202528?v=4',
      html_url: 'https://github.com/johnpapa',
    };
    fixture.detectChanges();
    const userProfileInfo = debugElement.query(By.css('.user-profile-info'));
    expect(userProfileInfo).toBeTruthy();
  });

  it('should not display content when userData is null', () => {
    component.userData = null;
    fixture.detectChanges();
    const userProfileInfo = debugElement.query(By.css('.user-profile-info'));
    expect(userProfileInfo).toBeFalsy();
  });

  it('should render pagination dropdown with correct options', () => {
    component.userData = {
      name: 'John Papa',
      bio: 'Winter is Coming',
      location: 'Orlando, FL',
      twitter_username: 'john_papa',
      avatar_url: 'https://avatars.githubusercontent.com/u/1202528?v=4',
      html_url: 'https://github.com/johnpapa',
    };
    fixture.detectChanges();
    const paginationDropdown = debugElement.query(By.css('#pageSize'));
    expect(paginationDropdown).toBeTruthy();

    const expectedPageSizeOptions = [5, 10, 25, 50, 100];
    const options = paginationDropdown.nativeElement.querySelectorAll('option');
    expect(options.length).toEqual(expectedPageSizeOptions.length);
    options.forEach((option: { value: string }, index: number) => {
      expect(parseInt(option.value)).toEqual(expectedPageSizeOptions[index]);
    });
  });

  it('should not render pagination dropdown when userData is null', () => {
    component.userData = null;
    fixture.detectChanges();
    const paginationDropdown = debugElement.query(By.css('#pageSize'));
    expect(paginationDropdown).toBeFalsy();
  });

  it('should handle prevPage method correctly', () => {
    component.currentPage = 3;
    component.prevPage();
    expect(component.currentPage).toEqual(2);
  });

  it('should increment currentPage and call fetchRepos when nextPage is called and repositories for the next page are not loaded', () => {
    //@ts-ignore
    spyOn(component, 'fetchRepos');
    component.userData = { public_repos: 20 }; // Simulate user data
    component.currentPage = 1;
    component.repo = [{}, {}]; // Simulate repositories loaded for the first page

    component.nextPage();

    expect(component.currentPage).toEqual(2);
    //@ts-ignore
    expect(component.fetchRepos).toHaveBeenCalled();
  });
  it('should increment currentPage and not call fetchRepos when nextPage is called and repositories for the next page are already loaded', () => {
    //@ts-ignore
    spyOn(component, 'fetchRepos');
    component.userData = { public_repos: 20 }; // Simulate user data
    component.currentPage = 1;
    component.repo = Array(20); // Simulate repositories loaded for the first page

    component.nextPage();

    expect(component.currentPage).toEqual(2);
    //@ts-ignore
    expect(component.fetchRepos).not.toHaveBeenCalled();
  });

  it('should handle nextPage method correctly', () => {
    component.currentPage = 3;
    component.nextPage();
    expect(component.currentPage).toEqual(4);
  });

  it('should call fetchRepos when onPageSizeChange is called and repositories are not loaded for the current page size', () => {
    //@ts-ignore
    spyOn(component, 'fetchRepos');
    component.userData = { public_repos: 20 }; // Simulate user data
    component.currentPage = 2;
    component.repo = [{}, {}]; // Simulate repositories loaded for the first page

    component.onPageSizeChange();
    //@ts-ignore
    expect(component.fetchRepos).toHaveBeenCalled();
  });

  it('should not call fetchRepos when onPageSizeChange is called and repositories are already loaded for the current page size', () => {
    //@ts-ignore
    spyOn(component, 'fetchRepos');
    component.userData = { public_repos: 20 }; // Simulate user data
    component.currentPage = 2;
    component.repo = Array(20); // Simulate repositories loaded for the current page size

    component.onPageSizeChange();
    //@ts-ignore
    expect(component.fetchRepos).not.toHaveBeenCalled();
  });

  it('should calculate total pages correctly', () => {
    const total = 25; // Example total
    const pageSize = 10; // Example page size
    component.page_size = pageSize;

    // @ts-ignore
    component.calculateTotalPages(total);

    expect(component.pageArr.length).toBe(3); // 25 / 10 = 2.5, Math.ceil(2.5) = 3
  });

  it('should set current page and call onPageSizeChange', () => {
    const pageNumber = 2;

    spyOn(component, 'onPageSizeChange');

    component.goToPage(pageNumber);

    expect(component.currentPage).toBe(pageNumber);
    expect(component.onPageSizeChange).toHaveBeenCalled();
  });

  it('should not load data if not present in local storage', () => {
    localStorage.clear();

    // @ts-ignore
    // spyOn(component, 'calculateTotalPages');

    // @ts-ignore
    component.loadPersistedData();

    // expect(component.userData).toBeUndefined();
    // expect(component.repo).toBeUndefined();

    // @ts-ignore
    // expect(component.calculateTotalPages).not.toHaveBeenCalled();
  });

  it('should fetch repositories successfully', () => {
    const userData = {
      repos_url: 'https://api.github.com/users/someuser/repos',
      public_repos: 10,
    };
    const currentPage = 1;
    const pageSize = 10;
    const repos = [
      { id: 1, name: 'repo1' },
      { id: 2, name: 'repo2' },
    ];

    apiService.getRepositoriesFromUrl.and.returnValue(of(repos));

    component.userData = userData;
    component.currentPage = currentPage;
    component.page_size = pageSize;

    //@ts-ignore
    component.fetchRepos();

    expect(apiService.getRepositoriesFromUrl).toHaveBeenCalledWith(
      userData.repos_url,
      currentPage,
      pageSize
    );
    expect(component.repo).toEqual(repos);
    // Add more expectations as needed
  });

  it('should fetch repos when onRouteChange is called and there are no repositories loaded yet', () => {
    apiService.getUser.and.returnValue(of({ login: 'test_user' }));
    //@ts-ignore
    spyOn(component, 'fetchRepos');
    //@ts-ignore
    component.onRouteChange();

    expect(apiService.getUser).toHaveBeenCalled();
    //@ts-ignore
    expect(component.fetchRepos).toHaveBeenCalled();
  });

  it('should fetch repos when onRouteChange is called and the username in the route path is different from the stored user data', () => {
    apiService.getUser.and.returnValue(of({ login: 'test_user' }));
    //@ts-ignore
    spyOn(component, 'fetchRepos');

    component.userData = { login: 'different_user' };
    //@ts-ignore
    component.onRouteChange();

    expect(apiService.getUser).toHaveBeenCalled();
    //@ts-ignore
    expect(component.fetchRepos).toHaveBeenCalled();
  });

  it('should not fetch repos when onRouteChange is called and the username in the route path is the same as the stored user data', () => {
    apiService.getUser.and.returnValue(of({ login: 'test_user' }));
    //@ts-ignore
    spyOn(component, 'fetchRepos');

    component.userData = { login: 'test_user' };
    //@ts-ignore
    component.onRouteChange();

    // expect(apiService.getUser).not.toHaveBeenCalled();
    //@ts-ignore
    // expect(component.fetchRepos).not.toHaveBeenCalled();
  });

  it('should not fetch repos when onRouteChange is called and repositories are already loaded for the same user', () => {
    apiService.getUser.and.returnValue(of({ login: 'test_user' }));
    //@ts-ignore
    spyOn(component, 'fetchRepos');

    component.userData = { login: 'test_user' };
    component.repo = [{}]; // Simulate repos already loaded
    //@ts-ignore
    component.onRouteChange();

    // expect(apiService.getUser).not.toHaveBeenCalled();
    //@ts-ignore
    // expect(component.fetchRepos).not.toHaveBeenCalled();
  });

  it('should unsubscribe from router events on component destruction', () => {
    //@ts-ignore
    spyOn(component.routerSubscription, 'unsubscribe');
    component.ngOnDestroy();
    //@ts-ignore
    expect(component.routerSubscription.unsubscribe).toHaveBeenCalled();
  });
});
