import {
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';

export type TooltipVariant = 'info' | 'error' | 'neutral';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const VARIANT_CLASSES: Record<TooltipVariant, string> = {
  info: 'bg-tooltip-info-bg text-tooltip-info-text',
  neutral: 'bg-tooltip-info-bg text-tooltip-info-text',
  error: 'bg-tooltip-error-bg border border-tooltip-error-border text-tooltip-error-text',
};

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  top: 'bottom-full left-0 mb-2',
  bottom: 'top-full left-0 mt-2',
  left: 'right-full top-0 mr-2',
  right: 'left-full top-0 ml-2',
};

@Component({
  selector: 'app-tooltip',
  imports: [IconButtonComponent],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  visible = input.required<boolean>();
  text = input<string>();
  variant = input<TooltipVariant>('info');
  position = input<TooltipPosition>('bottom');
  showCloseButton = input<boolean>(true);
  autoDismissMs = input<number | undefined>(5000);

  dismiss = output<void>();

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private wasVisible = false;

  variantClass = computed(() => VARIANT_CLASSES[this.variant()]);
  positionClass = computed(() => POSITION_CLASSES[this.position()]);

  constructor() {
    effect((onCleanup) => {
      const isVisible = this.visible();
      const justBecameVisible = isVisible && !this.wasVisible;
      this.wasVisible = isVisible;

      if (justBecameVisible) {
        const ms = this.autoDismissMs();
        if (ms) {
          const timer = setTimeout(() => this.dismiss.emit(), ms);
          onCleanup(() => clearTimeout(timer));
        }
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.visible()) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.dismiss.emit();
    }
  }

  onCloseClick(): void {
    this.dismiss.emit();
  }
}
