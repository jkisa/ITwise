import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  form = { name: '', email: '', message: '' };
  sending = false;
  sent = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupTransition();
    this.setupReveal();
    this.setupInputEffects();
  }

  private setupTransition(): void {
    const section = document.querySelector('.contact') as HTMLElement;
    gsap.fromTo(section,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  private setupReveal(): void {
    // Staggered left column
    gsap.fromTo('.contact__eyebrow, .contact__headline, .contact__sub, .contact__info-item',
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact__inner',
          start: 'top 82%'
        }
      }
    );

    // Form slides in from right
    gsap.fromTo('.contact__form-wrap',
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact__form-wrap',
          start: 'top 85%'
        }
      }
    );

    // Orbs scale in
    gsap.fromTo('.contact__orb',
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 1.4,
        stagger: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 80%'
        }
      }
    );
  }

  private setupInputEffects(): void {
    const inputs = document.querySelectorAll<HTMLElement>('.contact__input, .contact__textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          borderColor: 'rgba(167,139,250,0.6)',
          boxShadow: '0 0 0 3px rgba(167,139,250,0.08)',
          duration: 0.3
        });
      });
      input.addEventListener('blur', () => {
        gsap.to(input, {
          borderColor: 'rgba(255,255,255,0.07)',
          boxShadow: 'none',
          duration: 0.3
        });
      });
    });
  }

  onSubmit(): void {
    if (this.sending || this.sent) return;
    this.sending = true;

    // Animate button
    gsap.to('.contact__submit', {
      scale: 0.97, duration: 0.1,
      yoyo: true, repeat: 1
    });

    // Simulate sending
    setTimeout(() => {
      this.sending = false;
      this.sent = true;
      this.form = { name: '', email: '', message: '' };

      gsap.fromTo('.contact__success',
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }, 1800);
  }
}