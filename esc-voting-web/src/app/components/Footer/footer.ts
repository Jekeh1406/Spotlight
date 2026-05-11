import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    {name: 'GitHub', url: 'https://github.com/votre-username', icon: 'github'},
    {name: 'LinkedIn', url: 'https://linkedin.com/in/votre-profile', icon: 'linkedin'},
    {name: 'Twitter', url: 'https://twitter.com/votre-username', icon: 'twitter'},
  ];
}
