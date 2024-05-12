import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router,) {}
  
  found = false

  model = {
    name: '',
  };

  searchGithubAccount(username: string) {
    console.log('first');
    return this.apiService.getUser(username).subscribe({
      next: value => console.log('Observable emitted the next value: ', value  ),
      error: err => console.error('Observable emitted an error: ', err),
      complete: () => console.log('Observable emitted the complete notification')
    });
  }
  onSubmit() {
    // this.searchGithubAccount(this.model.name);
    this.router.navigate([`/${this.model.name}`]);
  }

  ngOnInit() {
    // this.apiService.getUser('johnpapa').subscribe(console.log);
  }
}