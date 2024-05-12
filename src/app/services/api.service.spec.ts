import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should call GitHub API with the correct URL', () => {
    const githubUsername = 'johnpapa';
    const expectedUrl = `https://api.github.com/users/${githubUsername}`;

    service.getUser(githubUsername).subscribe();

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
  });

  it('should return the user data from GitHub API', () => {
    const githubUsername = 'johnpapa';
    const mockUserData = { login: 'johnpapa', public_repos: 145 }; // Mock user data

    service.getUser(githubUsername).subscribe((user) => {
      expect(user).toEqual(mockUserData);
    });

    const req = httpTestingController.expectOne(
      `https://api.github.com/users/${githubUsername}`
    );
    req.flush(mockUserData);
  });

  it('should call octokit with the correct URL and parameters', () => {
    const reposUrl = 'https://api.github.com/users/johnpapa/repos';
    const page = 1;
    const perPage = 10;
    const expectedUrl = `${reposUrl}?page=${page}&per_page=${perPage}`;

    spyOn(service['octokit'], 'request').and.returnValue(
      Promise.resolve({ data: [] } as any)
    );

    service.getRepositoriesFromUrl(reposUrl, page, perPage).subscribe();

    expect(service['octokit'].request).toHaveBeenCalledWith(
      'GET ' + expectedUrl
    );
  });

  it('should return the repository data from octokit', () => {
    const reposUrl = 'https://api.github.com/users/johnpapa/repos';
    const page = 1;
    const perPage = 10;
    const mockRepoData = [
      { id: 1, name: 'repo1' },
      { id: 2, name: 'repo2' },
    ]; // Mock repository data

    spyOn(service['octokit'], 'request').and.returnValue(
      Promise.resolve({ data: mockRepoData } as any)
    );

    service
      .getRepositoriesFromUrl(reposUrl, page, perPage)
      .subscribe((repos) => {
        expect(repos).toEqual(mockRepoData);
      });
  });

  it('should handle errors appropriately', () => {
    const reposUrl = 'https://api.github.com/users/johnpapa/repos';
    const page = 1;
    const perPage = 10;
    const errorMessage = 'An error occurred';

    spyOn(service['octokit'], 'request').and.returnValue(
      Promise.reject(errorMessage)
    );

    service.getRepositoriesFromUrl(reposUrl, page, perPage).subscribe({
      error: (err) => {
        expect(err).toBe(errorMessage);
      },
    });
  });
});
