import { Component } from '@angular/core';

import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzLayoutModule, NzIconModule, NzFlexModule, NzTypographyModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  email = 'oleksandr.zwick@gmail.com';
}
