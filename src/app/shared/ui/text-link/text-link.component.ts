import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TooltipComponent } from '../tooltip/tooltip.component';

export type TextLinkWeight = 'regular' | 'bold';
export type TextLinkIconPosition = 'left' | 'right';

@Component({
  selector: 'app-text-link',
  imports: [RouterLink, LucideAngularModule, TooltipComponent],
  templateUrl: './text-link.component.html',
  styleUrl: './text-link.component.scss',
})
export class TextLinkComponent {
  label = input.required<string>();
  routerLink = input<string | string[]>();
  weight = input<TextLinkWeight>('regular');
  comingSoon = input<boolean>(false);
  comingSoonText = input<string>('Coming soon...');
  icon = input<string>();
  iconPosition = input<TextLinkIconPosition>('left');

  clicked = output<void>();

  showComingSoonTooltip = signal(false);

  weightClass = computed(() => (this.weight() === 'bold' ? 'font-semibold' : 'font-normal'));

  onClick(event: MouseEvent): void {
    if (this.routerLink()) {
      return;
    }

    event.preventDefault();

    if (this.comingSoon()) {
      this.showComingSoonTooltip.set(!this.showComingSoonTooltip());
      return;
    }

    this.clicked.emit();
  }

  onTooltipDismiss(): void {
    this.showComingSoonTooltip.set(false);
  }
}
