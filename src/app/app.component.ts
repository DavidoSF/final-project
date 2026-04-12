import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { restoreSession } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'final-project';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(restoreSession());
  }
}
