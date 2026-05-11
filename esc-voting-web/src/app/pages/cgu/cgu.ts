import {Component} from '@angular/core';
import {NavbarComponent} from '../../components/Navbar/navbar-component/navbar-component';
import {FooterComponent} from '../../components/Footer/footer';

@Component({
  selector: 'app-cgu',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './cgu.html',
  styleUrl: './cgu.css',
})
export class CguComponent {}
