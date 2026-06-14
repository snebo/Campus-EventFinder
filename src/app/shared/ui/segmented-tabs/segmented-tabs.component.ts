import { Component, input, output } from '@angular/core';

export interface SegmentedTab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-segmented-tabs',
  imports: [],
  templateUrl: './segmented-tabs.component.html',
  styleUrl: './segmented-tabs.component.scss',
})
export class SegmentedTabsComponent {
  tabs = input.required<SegmentedTab[]>();
  activeValue = input.required<string>();

  tabChange = output<string>();

  onSelect(value: string): void {
    if (value !== this.activeValue()) {
      this.tabChange.emit(value);
    }
  }
}
