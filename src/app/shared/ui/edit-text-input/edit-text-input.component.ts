import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-edit-text-input',
  standalone: true,
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './edit-text-input.component.html',
  styleUrl: './edit-text-input.component.scss',
})
export class EditTextInputComponent {
  label = input.required<string>();
  type = input<string>('text');
  value = model<string>('');
}
