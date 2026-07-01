import { Component, input, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LucideAngularModule, CheckIcon} from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ButtonComponent, LucideAngularModule],
  selector: 'app-create-event-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss',
})
export class SuccessModalComponent {
  heading = input<string>('Event Created Successfully');
  subheading = input<string>('Your campus event is now live and visible to other students');
  eventId = input<string>();
  protected readonly CheckIcon = CheckIcon;

}
