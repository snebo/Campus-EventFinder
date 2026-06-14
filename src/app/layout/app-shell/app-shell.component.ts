import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { AppTopBarComponent } from '../app-top-bar/app-top-bar.component';
import { NavDrawerComponent } from '../nav-drawer/nav-drawer.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, AppTopBarComponent, NavDrawerComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly router = inject(Router);

  readonly drawerOpen = signal(false);

  readonly activeRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.normalize(this.router.url)),
    ),
    { initialValue: this.normalize(this.router.url) },
  );

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  goToAccount(): void {
    void this.router.navigate(['/account']);
  }

  private normalize(url: string): string {
    return url.split(/[?#]/)[0];
  }
}
