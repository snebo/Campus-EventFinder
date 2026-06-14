import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

const DEFAULT_ASPECT_RATIO = '16/9';

@Component({
  selector: 'app-image-placeholder',
  imports: [LucideAngularModule],
  templateUrl: './image-placeholder.component.html',
  styleUrl: './image-placeholder.component.scss',
})
export class ImagePlaceholderComponent {
  aspectRatio = input<string>(DEFAULT_ASPECT_RATIO);
}
