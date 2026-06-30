import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserProfile {
  id: string;
  fullName: string;
  memberType?: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-card.component.html',
  styleUrl: './user-profile-card.component.scss',
})
export class UserProfileCardComponent {
  user = input.required<UserProfile>();
  clickable = input<boolean>(false);
  clicked = output<string>();

  onCardClick(): void {
    if (this.clickable()) {
      this.clicked.emit(this.user().id);
    }
  }

  get initials(): string {
    return this.user()
      .fullName.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

}
