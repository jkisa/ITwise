import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  values = [
    { icon: '◈', title: 'Mission', text: 'Partner of choice delivering technology solutions with lasting commercial benefit.' },
    { icon: '◉', title: 'Vision',  text: 'Leading IT solutions provider exceeding our customers\' expectations every time.' },
    { icon: '✦', title: 'Slogan',  text: '"Ask IT. Have IT." — We make technology simple, accessible and powerful.' },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupAnimations();
  }

  private setupAnimations(): void {
    // Section fade in
    gsap.fromTo('.about2',
      { opacity: 0, y: 60 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { 
          trigger: '.about2', 
          start: 'top 85%',
          end: 'top 50%',
          scrub: false
        }
      }
    );

    // Eyebrow slide in from left
    gsap.fromTo('.about2__eyebrow',
      { x: -80, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about2', start: 'top 80%' }
      }
    );

    // Headline split animation (words stagger)
    gsap.fromTo('.about2__headline',
      { y: 100, opacity: 0, rotateX: 45 },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.about2__headline', start: 'top 85%' }
      }
    );

    // Body text fade up
    gsap.fromTo('.about2__body',
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.9,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about2__body', start: 'top 90%' }
      }
    );

    // Value cards stagger with 3D flip
    gsap.fromTo('.about2__value',
      { 
        y: 60, 
        opacity: 0,
        rotateY: -15
      },
      { 
        y: 0, 
        opacity: 1,
        rotateY: 0,
        stagger: 0.15, 
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.about2__values', start: 'top 85%' }
      }
    );

    // Glass panel slide in from right
    gsap.fromTo('.about2__glass-panel',
      { x: 100, opacity: 0, scale: 0.9 },
      { 
        x: 0, 
        opacity: 1,
        scale: 1,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about2__right', start: 'top 80%' }
      }
    );

    // Stats counter animation
    gsap.fromTo('.about2__glass-num',
      { textContent: '0', opacity: 0 },
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: { trigger: '.about2__glass-panel', start: 'top 85%' }
      }
    );
  }
}