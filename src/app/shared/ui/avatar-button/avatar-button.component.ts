import { Component, input, output } from '@angular/core';

import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-avatar-button',
  imports: [IconButtonComponent],
  templateUrl: './avatar-button.component.html',
  styleUrl: './avatar-button.component.scss',
})
export class AvatarButtonComponent {
  imageUrl = input<string>();
  ariaLabel = input<string>('Account');

  clicked = output<void>();
}
