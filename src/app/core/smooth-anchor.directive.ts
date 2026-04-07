import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'a[smoothAnchor]',
  standalone: true
})
export class SmoothAnchorDirective {
  @Input() smoothAnchor!: string;

  constructor(private router: Router) {}

  @HostListener('click', ['$event'])
  onClick(e: Event): void {
    e.preventDefault();
    const targetId = this.smoothAnchor.replace('#', '');
    const target = document.getElementById(targetId);
    
    if (target) {
      // If we're not on the home route, navigate there first
      if (this.router.url !== '/') {
        this.router.navigate(['/'], { fragment: targetId }).then(() => {
          this.scrollToElement(target);
        });
      } else {
        this.scrollToElement(target);
      }
    }
  }

  private scrollToElement(el: HTMLElement): void {
    // Lenis handles the actual smooth scroll
    // We just need to trigger it via anchor
    window.location.hash = el.id;
  }
}