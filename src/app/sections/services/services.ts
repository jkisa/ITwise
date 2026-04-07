import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThreeBackgroundService } from '../../core/three-background.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss']
})
export class ServicesComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private threeBg = inject(ThreeBackgroundService);
  
  activeIndex = 0;
  
  services = [
    { number: '01', title: 'Online Support', desc: 'Prompt, reliable customer support that exceeds expectations and fosters positive referrals.', tag: 'Always On', color: '#38bdf8', grad: 'linear-gradient(135deg,#38bdf8,#0891b2)', icon: '⬡', id: 0 },
    { number: '02', title: 'System Integration', desc: 'We analyze your processes and recommend the right hardware and software — integrated end-to-end.', tag: 'Full Stack', color: '#60a5fa', grad: 'linear-gradient(135deg,#60a5fa,#3b82f6)', icon: '⬢', id: 1 },
    { number: '03', title: 'Security Systems', desc: 'From simple CCTV to fully integrated surveillance — planned, configured and operated with you.', tag: 'Protected', color: '#818cf8', grad: 'linear-gradient(135deg,#818cf8,#6366f1)', icon: '◈', id: 2 },
    { number: '04', title: 'Software Development', desc: 'Bespoke websites and apps tailored to your challenges, built to integrate with what you have.', tag: 'Custom Built', color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#a855f7)', icon: '◉', id: 3 },
    { number: '05', title: 'IT Infrastructure', desc: 'Hardware and software installation handled with precision — seamless integration guaranteed.', tag: 'Scalable', color: '#22d3ee', grad: 'linear-gradient(135deg,#22d3ee,#06b6d4)', icon: '⬟', id: 4 },
    { number: '06', title: 'Analysis & Consulting', desc: 'Business process reviews, stakeholder engagement and holistic IT project planning.', tag: 'Strategic', color: '#e0f2fe', grad: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', icon: '◎', id: 5 },
    { number: '07', title: 'Analytics, BI & AI', desc: 'BI solutions that collect and analyze real-time data — turning numbers into decisions.', tag: 'Intelligent', color: '#a5b4fc', grad: 'linear-gradient(135deg,#a5b4fc,#818cf8)', icon: '✦', id: 6 }
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupAnimations();
    
    // Initialize first 3D highlight after a delay to ensure scene is ready
    setTimeout(() => {
      this.threeBg.highlightService(0, true);
    }, 500);
  }

  setActive(index: number): void {
    // Unhighlight previous
    if (this.activeIndex !== -1 && this.activeIndex !== index) {
      this.threeBg.highlightService(this.activeIndex, false);
    }
    
    // Highlight new
    if (this.activeIndex !== index) {
      this.threeBg.highlightService(index, true);
    }
    
    this.activeIndex = index;
    
    // Animate preview panel content refresh
    gsap.fromTo('.svc2__preview-content',
      { y: 20, opacity: 0.7, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
    );
    
    // Animate the big number
    gsap.fromTo('.svc2__big-number',
      { scale: 1.2, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }
    );
  }

  onItemHover(index: number, entering: boolean): void {
    if (entering && index !== this.activeIndex) {
      this.setActive(index);
    }
  }

  private setupAnimations(): void {
    // Section reveal with clip-path
    gsap.fromTo('.svc2',
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.svc2', start: 'top 90%' }
      }
    );

    // Headline split reveal
    gsap.fromTo('.svc2__headline',
      { y: 80, opacity: 0, skewY: 5 },
      {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.svc2__header', start: 'top 80%' }
      }
    );

    // Eyebrow pulse in
    gsap.fromTo('.svc2__eyebrow',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.svc2__header', start: 'top 85%' }
      }
    );

    // List items cascade in
    gsap.fromTo('.svc2__item',
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc2__list', start: 'top 85%' }
      }
    );

    // Preview panel 3D flip in
    gsap.fromTo('.svc2__preview',
      { rotateY: 30, x: 50, opacity: 0 },
      {
        rotateY: 0,
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc2__preview', start: 'top 85%' }
      }
    );

    // Marquee start
    gsap.to('.svc2__marquee-track', {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1
    });
  }
}