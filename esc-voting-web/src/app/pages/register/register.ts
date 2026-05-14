import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {FloatingParticlesComponent} from '../../components/animations/floating-particles/floating-particles.component';
import {PasswordRulesComponent} from '../../components/PasswordRules/password-rules';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FloatingParticlesComponent, RouterLink, PasswordRulesComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  isPasswordValid = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  onPasswordValidChange(valid: boolean): void {
    this.isPasswordValid = valid;
  }

  register() {
    this.errorMessage = '';

    if (this.registerForm.invalid || !this.isPasswordValid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const {firstName, lastName, email, password} = this.registerForm.value;

    this.authService.register({firstName, lastName, email, password})
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription.';
        }
      });
  }
}
