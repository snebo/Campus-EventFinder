import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextInputType = 'text' | 'email' | 'password';

const BASE_CLASSES =
  'w-full border bg-surface-elevated px-3 py-4 text-input text-text-primary placeholder-text-placeholder outline-none transition-colors';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  placeholder = input.required<string>();
  type = input<TextInputType>('text');
  id = input.required<string>();
  disabled = input<boolean>(false);
  invalid = input<boolean>(false);
  autocomplete = input<string>();

  blurred = output<void>();

  value = signal('');
  focused = signal(false);

  private formDisabled = signal(false);

  isDisabled = computed(() => this.disabled() || this.formDisabled());

  borderClass = computed(() => (this.invalid() ? 'border-border-error' : this.focused() ? 'border-primary' : 'border-black-100'));

  ringClass = computed(() => (this.focused() && !this.isDisabled() ? 'shadow-focus-ring' : ''));

  disabledClass = computed(() => (this.isDisabled() ? 'opacity-50 cursor-not-allowed' : ''));

  inputClasses = computed(() =>
    [BASE_CLASSES, this.borderClass(), this.ringClass(), this.disabledClass()].filter(Boolean).join(' '),
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
    this.blurred.emit();
  }
}
