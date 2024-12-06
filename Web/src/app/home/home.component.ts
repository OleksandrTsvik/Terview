import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    NzCollapseModule,
    NzResultModule,
    NzTypographyModule,
    NzPaginationModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tags = [
    { name: 'web', selected: false },
    { name: 'js', selected: true },
    { name: '.net', selected: false },
    { name: 'asp.net core', selected: false },
  ];

  notes: { title: string; content: string }[] = [
    {
      title: 'Title 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      title: 'Title 2',
      content: 'Nam non diam rhoncus, fermentum sapien quis, luctus quam.',
    },
    {
      title: 'Title 3',
      content:
        'Praesent eget turpis sagittis, convallis urna sit amet, ornare dolor.',
    },
  ];

  onTagClick(name: string) {
    for (const tag of this.tags) {
      if (tag.name === name) {
        tag.selected = !tag.selected;
        break;
      }
    }
  }

  onPageIndexChange(page: number) {
    console.log('onPageIndexChange', page);
  }

  onPageSizeChange(size: number) {
    console.log('onPageSizeChange', size);
  }
}
