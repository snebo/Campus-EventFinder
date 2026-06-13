import { Component, computed, input } from '@angular/core';

export type FormFieldHelperVariant = 'default' | 'success' | 'error';

const HELPER_VARIANT_CLASSES: Record<FormFieldHelperVariant, string> = {
  default: 'text-text-secondary',
  success: 'text-text-success',
  error: 'text-text-error',
};

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  label = input.required<string>();
  for = input.required<string>();
  helperText = input<string>();
  helperTextVariant = input<FormFieldHelperVariant>('default');
  errorText = input<string | null>(null);

  private hasError = computed(() => !!this.errorText());

  messageText = computed(() => (this.hasError() ? this.errorText() : this.helperText()));

  messageClass = computed(() =>
    ['text-helper', this.hasError() ? HELPER_VARIANT_CLASSES.error : HELPER_VARIANT_CLASSES[this.helperTextVariant()]].join(
      ' ',
    ),
  );
}
