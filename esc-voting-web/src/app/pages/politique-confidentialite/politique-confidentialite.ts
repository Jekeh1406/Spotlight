import {Component} from '@angular/core';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';

@Component({
  selector: 'app-politique-confidentialite',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './politique-confidentialite.html',
  styleUrl: './politique-confidentialite.css',
})
export class PolitiqueConfidentialiteComponent {}
