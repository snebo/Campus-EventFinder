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
  avatarUrl = input<string>();
  name = input.required<string>();
  subtitle = input.required<string>();
  editAvatar = output<void>();

  hasProfile(): boolean {
    if (this.avatarUrl()) return true
    return false
  }

  extractName(): String {
    return (this.name().split(' ').map((name)=> name[0])).join('')
  }
}
