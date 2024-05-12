import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private octokit: Octokit = new Octokit();

  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string) {
    return this.httpClient.get(
      `${environment.githubUrl}/users/${githubUsername}`
    );
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
  getRepositoriesFromUrl(
    reposUrl: string,
    page: number,
    perPage: number
  ): Observable<any> {
    return new Observable((observer) => {
      const urlWithParams = `${reposUrl}?page=${page}&per_page=${perPage}`;
      this.octokit
        .request('GET ' + urlWithParams)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
