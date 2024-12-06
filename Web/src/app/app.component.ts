import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule, FooterComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
