import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeBackgroundService } from './core/three-background.service';
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
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('bgCanvas') bgCanvasRef!: ElementRef<HTMLCanvasElement>;
  private platformId = inject(PLATFORM_ID);
  private threeBg = inject(ThreeBackgroundService);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Curtain open on load
    gsap.timeline()
      .to('.curtain__panel--top',    { scaleY: 0, duration: 1.2, ease: 'power4.inOut' }, 0)
      .to('.curtain__panel--bottom', { scaleY: 0, duration: 1.2, ease: 'power4.inOut' }, 0);

    // Curtain wipe between sections
    gsap.utils.toArray<HTMLElement>('section').forEach((section, i) => {
      if (i === 0) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.timeline()
            .to('.curtain__panel--top',    { scaleY: 1, duration: 0.45, ease: 'power4.in' }, 0)
            .to('.curtain__panel--bottom', { scaleY: 1, duration: 0.45, ease: 'power4.in' }, 0)
            .to('.curtain__panel--top',    { scaleY: 0, duration: 0.65, ease: 'power4.out', delay: 0.08 }, '+=0.05')
            .to('.curtain__panel--bottom', { scaleY: 0, duration: 0.65, ease: 'power4.out' }, '<');
        }
      });
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('🛑 SSR mode - skipping 3D');
      return;
    }
    
    console.log('🔍 Checking canvas ref:', this.bgCanvasRef);
    
    if (!this.bgCanvasRef) {
      console.error('❌ CRITICAL: bgCanvasRef is undefined! Check app.html has <canvas #bgCanvas>');
      return;
    }
    
    if (!this.bgCanvasRef.nativeElement) {
      console.error('❌ CRITICAL: bgCanvasRef.nativeElement is null');
      return;
    }
    
    const canvas = this.bgCanvasRef.nativeElement;
    console.log('✅ Canvas found:', canvas);
    console.log('📐 Canvas size:', canvas.clientWidth, 'x', canvas.clientHeight);
    
    // Force canvas visibility for debugging
    canvas.style.background = 'purple'; // You should see purple if canvas exists
    canvas.style.opacity = '0.3';
    
    try {
      console.log('🎨 Initializing Three.js...');
      await this.threeBg.init(canvas);
      console.log('✅ Three.js initialized successfully');
      
      // Remove debug background after init
      canvas.style.background = '';
      canvas.style.opacity = '';
      
    } catch (err) {
      console.error('❌ Three.js init failed:', err);
      return;
    }
    
    // Hide loader
    setTimeout(() => {
      const loader = document.getElementById('modelLoader');
      if (loader) {
        loader.classList.add('loaded');
        setTimeout(() => loader.remove(), 600);
      }
    }, 1500);
  }
}