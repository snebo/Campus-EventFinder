import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../data-access/auth.service'
import { AuthHeaderComponent } from '../shared/auth-header/auth-header.component';
import { ForgotPasswordFormValue } from '../data-access/auth.models';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, AuthHeaderComponent, ForgotPasswordFormComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
    
export class ForgotPasswordPageComponent {
  protected readonly successSent = signal(false);

  constructor(private readonly auth: AuthService) { }
  

  onSubmit(value: ForgotPasswordFormValue): void {
  this.auth.sendPasswordReset(value.email);
    this.successSent.set(true);
  }

 
}






