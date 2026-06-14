import { Component, input, output } from '@angular/core';

import { IconButtonComponent } from '../../shared/ui/icon-button/icon-button.component';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { NavLinkItemComponent } from './nav-link-item/nav-link-item.component';

export interface NavLink {
  label: string;
  routerLink: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', routerLink: '/home' },
  { label: 'Search', routerLink: '/search' },
  { label: 'Schedule', routerLink: '/schedule' },
  { label: 'Account', routerLink: '/account' },
];

@Component({
  selector: 'app-nav-drawer',
  imports: [LogoComponent, IconButtonComponent, NavLinkItemComponent],
  templateUrl: './nav-drawer.component.html',
  styleUrl: './nav-drawer.component.scss',
})
export class NavDrawerComponent {
  open = input.required<boolean>();
  activeRoute = input<string>('');
  links = input<NavLink[]>(DEFAULT_LINKS);

  close = output<void>();
}
