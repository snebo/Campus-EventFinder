import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  imports: [ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  private readonly router = inject(Router);

  message = input.required<string>();
  ctaLabel = input<string>();
  ctaRouterLink = input<string>();

  ctaClick = output<void>();

  onCtaClick(): void {
    const link = this.ctaRouterLink();
    if (link) {
      void this.router.navigate([link]);
      return;
    }
    this.ctaClick.emit();
  }
}
