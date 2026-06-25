import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonHtmlType = 'button' | 'submit';

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 px-4 py-3 text-button transition-colors cursor-pointer';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-dark text-white border border-transparent',
  secondary: 'bg-surface text-text-primary border border-transparent',
  outline: 'bg-transparent text-text-primary border border-border-default',
};

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label = input.required<string>();
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<ButtonHtmlType>('button');
  fullWidth = input<boolean>(true);
  icon = input<string | undefined>(undefined);
  customIcon = input<string | undefined>(undefined);
  textColor = input<string | undefined>(undefined);

  clicked = output<void>();

  isDisabled = computed(() => this.disabled() || this.loading());

  buttonClasses = computed(() =>
    [
      BASE_CLASSES,
      this.textColor() ? this.textColor() : VARIANT_CLASSES[this.variant()],
      this.fullWidth() ? 'w-full' : 'w-auto',
      this.isDisabled() ? 'opacity-50 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  onClick(): void {
    if (this.isDisabled()) {
      return;
    }
    this.clicked.emit();
  }
}
