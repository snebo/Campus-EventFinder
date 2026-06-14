import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-event-meta-row',
  imports: [LucideAngularModule],
  templateUrl: './event-meta-row.component.html',
  styleUrl: './event-meta-row.component.scss',
})
export class EventMetaRowComponent {
  icon = input.required<string>();
  text = input.required<string>();
}
