import { AuthService } from './../auth/data-access/auth.service';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { AuthSession } from '../auth/data-access/auth.models';
import { ProfileHeaderComponent } from '../../shared/ui/profile-header/profile-header.component';
import { SecurityLinkComponent } from '../../shared/ui/security-link/security-link.component';
import { EditTextInputComponent } from '../../shared/ui/edit-text-input/edit-text-input.component';
import { TooltipComponent } from '../../shared/ui/tooltip/tooltip.component';
import { TextDataComponent } from '../../shared/ui/text-data/text-data.component';

@Component({
  selector: 'app-account-page',
  imports: [
    PageHeaderComponent,
    ButtonComponent,
    ProfileHeaderComponent,
    SecurityLinkComponent,
    EditTextInputComponent,
    TooltipComponent,
    TextDataComponent,
  ],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showComingSoon = signal(false);
  serverErrorDismissed = signal(false);

  department = signal('Computer Engineering • 200lv • Unilag');
  avatar = signal('/assets/images/profile_image.png');

  protected readonly currentUser: AuthSession['user'] | null =
    this.authService.getSession()?.user ?? null;

  fullName = signal(this.currentUser?.fullName ?? '');
  email = signal(this.currentUser?.email ?? '');

  protected eventData =signal( [ {'Topic': 'Attended', 'Value': 13}, {'Topic': 'Saved', 'Value': 3}, {'Topic': 'RSVP', 'Value': 5}])
  protected interests = signal(['Tech', 'Music', 'Sports'])

  signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  onSave() {
    console.log('Saving profile data:', {
      name: this.currentUser?.fullName,
      email: this.currentUser?.email,
      dept: this.department(),
    });
  }

  onChangePassword() {
    console.log('Navigate to change password');
    this.showComingSoon.set(true);
  }

  onEditAvatar() {
    console.log('Trigger file upload');
    this.showComingSoon.set(true);
  }

  onServerErrorDismiss(): void {
    this.showComingSoon.set(false);
  }
}
