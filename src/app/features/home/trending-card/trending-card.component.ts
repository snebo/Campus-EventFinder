import { Component, input, output } from '@angular/core';
import { TrendingDetails } from '../../../shared/models/event.model';

@Component({
  selector: 'app-trending-card',
  imports: [],
  templateUrl: './trending-card.component.html',
  styleUrl: './trending-card.component.scss',
})
export class TrendingCardComponent {
  event = input.required<TrendingDetails>();
  clicked = output<string>();
}