import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';

@Component({
  selector: 'app-mentions-legales',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './mentions-legales.html',
  styleUrl: './mentions-legales.css',
})
export class MentionsLegalesComponent {}
