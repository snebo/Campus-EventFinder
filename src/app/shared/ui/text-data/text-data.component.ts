import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-text-data',
  templateUrl: './text-data.component.html',
  styleUrls: ['./text-data.component.scss'],
})
export class TextDataComponent {
  value = input<number>();
  topic = input.required<string>();

  width = input<string>();
  height = input<string>();

  editable = input<boolean>(false);
  clicked = output<void>();

  ngOnInit() {
    console.log('sizes', [this.width(), this.height()]);
    console.log('truthy', this.height() && this.width() ? 'yes' : 'no');
  }
  computedSize = computed(() =>
    this.height() && this.width() ? `h-${this.height()} w-${this.width()}` : 'w-28 h-20',
  );

  onClick(): void {
    if (!this.editable()) {
      return;
    }
    console.log('clicked', this.clicked);
    this.clicked.emit();
  }
}
