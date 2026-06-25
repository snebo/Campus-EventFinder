import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  avatarUrl = input.required<string>();
  name = input.required<string>();
  subtitle = input.required<string>();
  editAvatar = output<void>();
}
