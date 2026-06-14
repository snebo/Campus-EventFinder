import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { AuthService } from '../auth/data-access/auth.service';
import { AuthSession } from '../auth/data-access/auth.models';

@Component({
  selector: 'app-account-page',
  imports: [PageHeaderComponent, ButtonComponent],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser: AuthSession['user'] | null = this.authService.getSession()?.user ?? null;

  signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
