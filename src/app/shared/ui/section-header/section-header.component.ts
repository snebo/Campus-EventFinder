import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-section-header',
  imports: [LucideAngularModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  title = input.required<string>();
  actionLabel = input<string>();
  actionIcon = input<string>();

  actionClick = output<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
