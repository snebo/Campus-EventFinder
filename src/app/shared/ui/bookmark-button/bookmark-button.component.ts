import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-bookmark-button',
  imports: [LucideAngularModule],
  templateUrl: './bookmark-button.component.html',
  styleUrl: './bookmark-button.component.scss',
})
export class BookmarkButtonComponent {
  saved = input.required<boolean>();

  toggle = output<void>();

  icon = computed(() => (this.saved() ? 'BookmarkCheck' : 'Bookmark'));
  ariaLabel = computed(() => (this.saved() ? 'Remove bookmark' : 'Add bookmark'));

  onClick(): void {
    this.toggle.emit();
  }
}
