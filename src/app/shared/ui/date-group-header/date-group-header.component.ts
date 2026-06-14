import { Component, input } from '@angular/core';

@Component({
  selector: 'app-date-group-header',
  imports: [],
  templateUrl: './date-group-header.component.html',
  styleUrl: './date-group-header.component.scss',
})
export class DateGroupHeaderComponent {
  label = input.required<string>();
}
