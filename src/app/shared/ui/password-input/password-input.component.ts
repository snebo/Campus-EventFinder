import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { TextInputComponent, TextInputType } from '../text-input/text-input.component';

@Component({
  selector: 'app-password-input',
  imports: [ReactiveFormsModule, TextInputComponent, IconButtonComponent],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  placeholder = input.required<string>();
  id = input.required<string>();
  disabled = input<boolean>(false);
  invalid = input<boolean>(false);
  autocomplete = input<string>();

  visible = signal(false);

  innerControl = new FormControl('', { nonNullable: true });

  type = computed<TextInputType>(() => (this.visible() ? 'text' : 'password'));
  toggleIcon = computed(() => (this.visible() ? 'EyeOff' : 'Eye'));
  toggleLabel = computed(() => (this.visible() ? 'Hide password' : 'Show password'));

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.innerControl.valueChanges.subscribe((value) => this.onChange(value));
  }

  writeValue(value: string): void {
    this.innerControl.setValue(value ?? '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerControl.disable();
    } else {
      this.innerControl.enable();
    }
  }

  toggleVisibility(): void {
    this.visible.set(!this.visible());
  }

  onBlurred(): void {
    this.onTouched();
  }
}
