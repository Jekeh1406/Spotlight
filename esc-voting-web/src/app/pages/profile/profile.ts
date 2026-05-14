import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';
import {PasswordRulesComponent} from '../../components/PasswordRules/password-rules';
import {UserService} from '../../services/user-service';
import {User} from '../../interface/user/user';

interface ProfileFormValue {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, FooterComponent, PasswordRulesComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  user = signal<User | null>(null);
  isLoadingProfile = signal(false);
  isLoadingPassword = signal(false);
  hasProfileChanges = signal(false);
  isPasswordValid = signal(false);

  private initialProfileValues: ProfileFormValue | null = null;

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  isToastVisible = signal(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user.set(user);
      this.initProfileForm(user);
    });

    this.initPasswordForm();
  }

  private initProfileForm(user: User | null): void {
    this.initialProfileValues = {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    };

    this.profileForm = new FormGroup({
      firstName: new FormControl(this.initialProfileValues.firstName, Validators.required),
      lastName: new FormControl(this.initialProfileValues.lastName, Validators.required),
      email: new FormControl(this.initialProfileValues.email, [Validators.required, Validators.email]),
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.checkProfileChanges();
    });

    this.hasProfileChanges.set(false);
  }

  private checkProfileChanges(): void {
    if (!this.initialProfileValues) {
      this.hasProfileChanges.set(false);
      return;
    }

    const current = this.profileForm.value;
    const hasChanges =
      current.firstName !== this.initialProfileValues.firstName ||
      current.lastName !== this.initialProfileValues.lastName ||
      current.email !== this.initialProfileValues.email;

    this.hasProfileChanges.set(hasChanges);
  }

  private initPasswordForm(): void {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  onPasswordValidChange(valid: boolean): void {
    this.isPasswordValid.set(valid);
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.showToast('Veuillez remplir tous les champs correctement.', 'error');
      return;
    }

    this.isLoadingProfile.set(true);
    const {firstName, lastName, email} = this.profileForm.value;

    this.userService.updateProfile({firstName, lastName, email}).subscribe({
      next: () => {
        this.isLoadingProfile.set(false);
        this.initialProfileValues = {firstName, lastName, email};
        this.hasProfileChanges.set(false);
        this.showToast('Profil mis a jour avec succes !', 'success');
      },
      error: (err) => {
        this.isLoadingProfile.set(false);
        this.showToast(err.error?.message || 'Erreur lors de la mise a jour du profil.', 'error');
      },
    });
  }

  updatePassword(): void {
    if (!this.isPasswordValid()) {
      this.showToast('Veuillez respecter toutes les regles de securite.', 'error');
      return;
    }

    const {currentPassword, newPassword} = this.passwordForm.value;

    this.isLoadingPassword.set(true);

    this.userService.updatePassword({currentPassword, newPassword}).subscribe({
      next: () => {
        this.isLoadingPassword.set(false);
        this.passwordForm.reset();
        this.showToast('Mot de passe modifie avec succes !', 'success');
      },
      error: (err) => {
        this.isLoadingPassword.set(false);
        this.showToast(err.error?.message || 'Erreur lors de la modification du mot de passe.', 'error');
      },
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.isToastVisible.set(true);

    setTimeout(() => {
      this.isToastVisible.set(false);
    }, 3000);
  }
}
