import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type IconButtonVariant = 'default' | 'ghost';

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent hover:bg-surface',
  default: 'bg-surface-elevated border border-border-default',
};

@Component({
  selector: 'app-icon-button',
  imports: [LucideAngularModule],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  icon = input.required<string>();
  ariaLabel = input.required<string>();
  variant = input<IconButtonVariant>('ghost');

  clicked = output<void>();

  variantClass = computed(() => VARIANT_CLASSES[this.variant()]);
}
