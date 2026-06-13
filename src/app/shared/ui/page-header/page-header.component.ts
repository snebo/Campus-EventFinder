import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  title = input<string>('');
  subtitle = input<string>('');
  greetingName = input<string>();
  emoji = input<string>();

  heading = computed(() => {
    const greetingName = this.greetingName();
    if (!greetingName) {
      return this.title();
    }

    const emoji = this.emoji();
    return emoji ? `Hey ${greetingName}! ${emoji}` : `Hey ${greetingName}!`;
  });
}
