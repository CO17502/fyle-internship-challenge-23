import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  title = 'fyle-frontend-challenge';

  model = {
    name: '',
  };

  onSubmit() {
    this.router.navigate([`/${this.model.name}`]);
    this.model.name = '';
  }
}
