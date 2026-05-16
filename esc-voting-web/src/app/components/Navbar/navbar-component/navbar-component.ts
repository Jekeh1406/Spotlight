import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ClickOutsideDirective} from '../../../directives/click-outside-directive';
import {AuthService} from '../../../services/auth-service';
import {UserService} from '../../../services/user-service';
import {TAB} from '../../../models/enum/tab';

@Component({
  selector: 'app-navbar-component',
  imports: [
    ClickOutsideDirective
  ],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent {

  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  activeTab = signal<TAB>(TAB.MY_TOPS);
  protected readonly TAB = TAB;

  constructor(
    private router: Router,
    private authService: AuthService,
    protected userService: UserService,
  ) {
    // Set active tab based on current route
    const currentPath = this.router.url;
    if (currentPath.includes('my-tops')) {
      this.activeTab.set(TAB.MY_TOPS);
    } else if (currentPath.includes('groups')) {
      this.activeTab.set(TAB.GROUPS);
    } else {
      this.activeTab.set(TAB.MY_TOPS);
    }
  }


  navigate(route: string): void {
    const routeMap: { [key: string]: string } = {
      'vote': '/home',
      'my-tops': '/my-tops',
      'groups': '/groups',
      'global-ranking': '/global-ranking',
      'profile': '/profile',
      'settings': '/settings'
    };
    const targetRoute = routeMap[route] || `/${route}`;
    this.router.navigate([targetRoute]);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  logout(): void {
    this.authService.logout();
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: TAB): void {
    this.activeTab.set(tab);
  }
}
