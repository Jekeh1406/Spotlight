import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {FloatingParticlesComponent} from '../../components/animations/floating-particles/floating-particles.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatingParticlesComponent, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginFormGroup!: FormGroup;
  errorMessage = signal<string | null>(null);
  showPassword = false;

  constructor(private router: Router,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  login() {
    this.errorMessage.set(null);
    this.authService.login(this.loginFormGroup.value).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        if (error.status === 401 && error.error?.message === 'Invalid credentials.') {
          this.errorMessage.set('Email ou mot de passe incorrect');
        } else {
          this.errorMessage.set('Une erreur est survenue');
        }
      }
    });
  }
}
