import { LogoSize } from './../../../../shared/ui/logo/logo.component';
import { Component, input, signal } from '@angular/core';
import { IconButtonComponent } from '../../../../shared/ui/icon-button/icon-button.component';
import { LogoComponent } from '../../../../shared/ui/logo/logo.component';
import { TooltipComponent } from '../../../../shared/ui/tooltip/tooltip.component';

const DEFAULT_INFO_TOOLTIP_TEXT =
  'Eventfindr helps University of Lagos students discover, RSVP to, and keep track of campus events — all in one place.';

@Component({
  selector: 'app-auth-header',
  imports: [LogoComponent, IconButtonComponent, TooltipComponent],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent {
  brandName = input<string>('Eventfindr');
  lg: LogoSize = 'lg'
  showInfo = input<boolean>(true);
  infoTooltipText = input<string>(DEFAULT_INFO_TOOLTIP_TEXT);

  showInfoTooltip = signal(false);

  toggleInfoTooltip(): void {
    this.showInfoTooltip.set(!this.showInfoTooltip());
  }

  onTooltipDismiss(): void {
    this.showInfoTooltip.set(false);
  }
}
