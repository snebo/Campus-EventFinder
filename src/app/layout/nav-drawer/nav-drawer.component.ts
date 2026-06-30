import { Component, inject, input, output } from '@angular/core';

import { IconButtonComponent } from '../../shared/ui/icon-button/icon-button.component';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { NavLinkItemComponent } from './nav-link-item/nav-link-item.component';
import { UserProfileCardComponent } from '../../shared/ui/user-profile-card/user-profile-card.component';
import { AuthSession } from '../../features/auth/data-access/auth.models';
import { AuthService } from '../../features/auth/data-access/auth.service';

export interface NavLink {
  label: string;
  routerLink: string;
  icon? : string;
  lastItem : boolean;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', routerLink: '/home', icon: './assets/images/home-icon.png', lastItem: false },
  { label: 'Explore', routerLink: '/search', icon: './assets/images/compss-icon.png', lastItem: false },
  { label: 'Host Event', routerLink: '/create', icon: './assets/images/add-icon.png', lastItem: false },
  { label: 'My Schedule', routerLink: '/schedule', icon: './assets/images/calender-icon.png', lastItem: false },
  { label: 'Account', routerLink: '/account', icon: './assets/images/profile-icon.png', lastItem: true },
];

@Component({
  selector: 'app-nav-drawer',
  imports: [LogoComponent, IconButtonComponent, NavLinkItemComponent, UserProfileCardComponent],
  templateUrl: './nav-drawer.component.html',
  styleUrl: './nav-drawer.component.scss',
})
export class NavDrawerComponent {
  private readonly authService = inject(AuthService);

  hideIcon = true;
  open = input.required<boolean>();
  activeRoute = input<string>('');
  links = input<NavLink[]>(DEFAULT_LINKS);

  close = output<void>();

  protected readonly currentUser: AuthSession['user'] =
    this.authService.getSession()?.user ?? {
      id: '1234',
      email: 'example@mail.com',
      fullName: 'Default user',
      memberType: 'Pro Member',
    };

  getCurrentUser() {
    return this.currentUser
  }
}
