import { Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type LogoSize = 'sm' | 'md' | 'lg';

const ICON_SIZES: Record<LogoSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

const TEXT_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: 'text-sm font-bold',
  md: 'text-logo',
  lg: 'text-2xl font-bold',
};

@Component({
  selector: 'app-logo',
  imports: [LucideAngularModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  hideIcon = input<boolean>(false)
  hideIconText = input<boolean>(false)
  size = input<LogoSize>('md');
  brandName = input<string>('Eventfindr');

  iconSize = computed(() => ICON_SIZES[this.size()]);
  textSizeClass = computed(() => TEXT_SIZE_CLASSES[this.size()]);
}
