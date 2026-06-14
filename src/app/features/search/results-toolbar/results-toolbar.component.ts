import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-results-toolbar',
  imports: [],
  templateUrl: './results-toolbar.component.html',
  styleUrl: './results-toolbar.component.scss',
})
export class ResultsToolbarComponent {
  resultCount = input.required<number>();

  text = computed(() => {
    const count = this.resultCount();
    return `Showing ${count} ${count === 1 ? 'event' : 'events'}`;
  });
}
