import { Component, effect, input, output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, IconButtonComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  placeholder = input<string>('');
  showFilterButton = input<boolean>(false);
  value = input<string>('');

  valueChange = output<string>();
  filterClick = output<void>();
  submit = output<string>();

  protected readonly current = signal('');

  constructor() {
    effect(() => this.current.set(this.value()));
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.current.set(next);
    this.valueChange.emit(next);
  }

  onSubmit(): void {
    this.submit.emit(this.current());
  }
}
