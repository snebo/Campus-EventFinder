import { Component, input, output } from '@angular/core';

import { AvatarButtonComponent } from '../../shared/ui/avatar-button/avatar-button.component';
import { IconButtonComponent } from '../../shared/ui/icon-button/icon-button.component';

@Component({
  selector: 'app-top-bar',
  imports: [IconButtonComponent, AvatarButtonComponent],
  templateUrl: './app-top-bar.component.html',
  styleUrl: './app-top-bar.component.scss',
})
export class AppTopBarComponent {
  brandName = input<string>('Eventfindr');

  menuClick = output<void>();
  avatarClick = output<void>();
}
