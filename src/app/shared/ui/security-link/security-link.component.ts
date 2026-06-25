import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-security-link',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './security-link.component.html',
  styleUrl: './security-link.component.scss',
})
export class SecurityLinkComponent {
  label = input.required<string>();
  icon = input<string>('Lock');
  clicked = output<void>();
}
