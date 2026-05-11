import {Component, computed, effect, EventEmitter, Input, Output, signal} from '@angular/core';

@Component({
  selector: 'app-password-rules',
  standalone: true,
  templateUrl: './password-rules.html',
  styleUrl: './password-rules.css',
})
export class PasswordRulesComponent {
  @Input() showConfirmRule = true;
  @Input() showDifferentRule = false;
  @Output() validChange = new EventEmitter<boolean>();

  private _password = signal('');

  @Input() set password(value: string) {
    this._password.set(value || '');
  }

  private _confirmPassword = signal('');

  @Input() set confirmPassword(value: string) {
    this._confirmPassword.set(value || '');
  }

  private _currentPassword = signal<string | null>(null);

  @Input() set currentPassword(value: string | null) {
    this._currentPassword.set(value);
  }

  rules = {
    minLength: computed(() => this._password().length >= 8),
    hasUppercase: computed(() => /[A-Z]/.test(this._password())),
    hasLowercase: computed(() => /[a-z]/.test(this._password())),
    hasNumber: computed(() => /[0-9]/.test(this._password())),
    hasSpecialChar: computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(this._password())),
    isDifferent: computed(() => {
      const pwd = this._password();
      const current = this._currentPassword();
      return pwd.length > 0 && current !== null && pwd !== current;
    }),
    passwordsMatch: computed(() => {
      const pwd = this._password();
      const confirm = this._confirmPassword();
      return pwd.length > 0 && pwd === confirm;
    }),
  };

  isValid = computed(() => {
    const baseValid =
      this.rules.minLength() &&
      this.rules.hasUppercase() &&
      this.rules.hasLowercase() &&
      this.rules.hasNumber() &&
      this.rules.hasSpecialChar();

    const confirmValid = !this.showConfirmRule || this.rules.passwordsMatch();
    const differentValid = !this.showDifferentRule || this.rules.isDifferent();

    return baseValid && confirmValid && differentValid;
  });

  constructor() {
    effect(() => {
      this.validChange.emit(this.isValid());
    });
  }
}
