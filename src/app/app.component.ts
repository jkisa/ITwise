import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroComponent }     from './sections/hero/hero';
import { AboutComponent }    from './sections/about/about';
import { ServicesComponent } from './sections/services/services';
import { TeamComponent }     from './sections/team/team';
import { ContactComponent }  from './sections/contact/contact';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeroComponent, AboutComponent,
            ServicesComponent, TeamComponent, ContactComponent],
  template: `
    <div class="site-wrapper">
      <app-hero />
      <app-about />
      <app-services />
      <app-team />
      <app-contact />
    </div>
  `,
  styles: [`
    .site-wrapper { overflow: hidden; }
  `]
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    gsap.utils.toArray<HTMLElement>('section').forEach((section, i) => {
      if (i === 0) return;
      gsap.fromTo(section,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }
}