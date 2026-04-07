import { Injectable } from '@angular/core';
import gsap from 'gsap';

@Injectable({ providedIn: 'root' })
export class PageTransitionService {

  animateSectionIn(el: HTMLElement, direction: 'up' | 'down' = 'up'): void {
    const from = direction === 'up' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
    gsap.fromTo(el,
      { clipPath: from, opacity: 0 },
      {
        clipPath: 'inset(0% 0 0% 0)',
        opacity: 1,
        duration: 1.4,
        ease: 'power4.inOut'
      }
    );
  }

  animateSectionOut(el: HTMLElement, direction: 'up' | 'down' = 'up'): void {
    const to = direction === 'up' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)';
    gsap.to(el, {
      clipPath: to,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.inOut'
    });
  }
}
