import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-link-item',
  imports: [RouterLink],
  templateUrl: './nav-link-item.component.html',
  styleUrl: './nav-link-item.component.scss',
})
export class NavLinkItemComponent {
  label = input.required<string>();
  routerLink = input.required<string>();
  active = input<boolean>(false);

  labelClass = computed(() => (this.active() ? 'font-semibold text-text-primary' : 'text-text-secondary'));
}
