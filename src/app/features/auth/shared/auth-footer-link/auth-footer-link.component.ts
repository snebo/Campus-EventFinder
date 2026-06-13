import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-auth-footer-link',
  imports: [],
  templateUrl: './auth-footer-link.component.html',
  styleUrl: './auth-footer-link.component.scss',
})
export class AuthFooterLinkComponent {
  promptText = input.required<string>();
  actionText = input.required<string>();

  actionClick = output<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
