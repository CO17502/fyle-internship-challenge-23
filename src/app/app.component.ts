import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  title = 'fyle-frontend-challenge';

  model = {
    name: '',
  };

  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate([`/${this.model.name}`]);
    this.model.name = '';
  }
}
