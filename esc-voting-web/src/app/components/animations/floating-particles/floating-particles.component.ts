import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Particle} from '../../../interface/particle';

@Component({
  selector: 'app-floating-particles',
  imports: [],
  templateUrl: './floating-particles.component.html',
  styleUrl: './floating-particles.component.scss',
})
export class FloatingParticlesComponent implements OnInit, OnDestroy {
  particles: Particle[] = [];
  private particleInterval: number = 0;


  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
    const container = this.el.nativeElement.querySelector('.floating-particles');

    // Créer continuellement de nouvelles particules
    this.particleInterval = setInterval(() => {
      this.createParticle(container);
    }, 0.02);
  }

  ngOnDestroy() {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
  }

  createParticle(container: HTMLElement) {
    const particle = this.renderer.createElement('div');
    this.renderer.addClass(particle, 'particle');

    const types = ['', 'gold', 'purple'];
    const type = types[Math.floor(Math.random() * types.length)];
    if (type) this.renderer.addClass(particle, type);

    const size = Math.random() * 6 + 2;
    this.renderer.setStyle(particle, 'width', size + 'px');
    this.renderer.setStyle(particle, 'height', size + 'px');
    this.renderer.setStyle(particle, 'left', Math.random() * 100 + '%');

    const duration = Math.random() * 8 + 10;
    this.renderer.setStyle(particle, 'animation-duration', duration + 's');

    const drift = (Math.random() - 0.5) * 100;
    this.renderer.setStyle(particle, '--drift', drift + 'px');

    this.renderer.appendChild(container, particle);

    setTimeout(() => {
      this.renderer.removeChild(container, particle);
    }, duration * 1000);
  }

}
