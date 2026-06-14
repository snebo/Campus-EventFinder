import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type ChipVariant = 'select' | 'dismissible' | 'dropdown';

const BASE_CLASSES =
  'inline-flex items-center gap-1.5 rounded-chip border px-3 py-1.5 text-label uppercase transition-colors';

@Component({
  selector: 'app-chip',
  imports: [LucideAngularModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  label = input.required<string>();
  variant = input.required<ChipVariant>();
  selected = input<boolean>(false);

  clicked = output<void>();
  dismiss = output<void>();

  // dismissible is always rendered in the dark "selected" treatment.
  private readonly isDark = computed(() => this.variant() === 'dismissible' || this.selected());

  chipClasses = computed(() =>
    [
      BASE_CLASSES,
      this.isDark()
        ? 'bg-chip-bg-selected border-transparent text-white'
        : 'bg-chip-bg border-border-default text-text-primary',
    ].join(' '),
  );

  onClick(): void {
    this.clicked.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
