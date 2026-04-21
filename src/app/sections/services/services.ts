import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThreeBackgroundService } from '../../core/three-background.service';
import * as THREE from 'three';
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
    { number: '01', title: 'Online Support',       desc: 'Prompt, reliable customer support that exceeds expectations and fosters positive referrals.',                    tag: 'Always On',   color: '#38bdf8', grad: 'linear-gradient(135deg,#38bdf8,#0891b2)', icon: '⬡', id: 0 },
    { number: '02', title: 'System Integration',   desc: 'We analyze your processes and recommend the right hardware and software — integrated end-to-end.',              tag: 'Full Stack',  color: '#60a5fa', grad: 'linear-gradient(135deg,#60a5fa,#3b82f6)', icon: '⬢', id: 1 },
    { number: '03', title: 'Security Systems',     desc: 'From simple CCTV to fully integrated surveillance — planned, configured and operated with you.',                tag: 'Protected',   color: '#818cf8', grad: 'linear-gradient(135deg,#818cf8,#6366f1)', icon: '◈', id: 2 },
    { number: '04', title: 'Software Development', desc: 'Bespoke websites and apps tailored to your challenges, built to integrate with what you have.',                 tag: 'Custom Built',color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#a855f7)', icon: '◉', id: 3 },
    { number: '05', title: 'IT Infrastructure',    desc: 'Hardware and software installation handled with precision — seamless integration guaranteed.',                   tag: 'Scalable',    color: '#22d3ee', grad: 'linear-gradient(135deg,#22d3ee,#06b6d4)', icon: '⬟', id: 4 },
    { number: '06', title: 'Analysis & Consulting',desc: 'Business process reviews, stakeholder engagement and holistic IT project planning.',                            tag: 'Strategic',   color: '#e0f2fe', grad: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', icon: '◎', id: 5 },
    { number: '07', title: 'Analytics, BI & AI',   desc: 'BI solutions that collect and analyze real-time data — turning numbers into decisions.',                        tag: 'Intelligent', color: '#a5b4fc', grad: 'linear-gradient(135deg,#a5b4fc,#818cf8)', icon: '✦', id: 6 }
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setupAnimations();
    this.initTyping();
    this.initCounters();
    this.initOctahedron();

    setTimeout(() => {
      this.threeBg.highlightService(0, true);
    }, 500);
  }

  setActive(index: number): void {
    if (this.activeIndex !== -1 && this.activeIndex !== index) {
      this.threeBg.highlightService(this.activeIndex, false);
    }
    if (this.activeIndex !== index) {
      this.threeBg.highlightService(index, true);
    }

    this.activeIndex = index;

    gsap.fromTo('.svc2__preview-content',
      { y: 20, opacity: 0.7, scale: 0.98 },
      { y: 0,  opacity: 1,   scale: 1,    duration: 0.4, ease: 'power3.out' }
    );
    gsap.fromTo('.svc2__big-number',
      { scale: 1.2, opacity: 0.5 },
      { scale: 1,   opacity: 1,   duration: 0.5, ease: 'elastic.out(1, 0.5)' }
    );
  }

  onItemHover(index: number, entering: boolean): void {
    if (entering && index !== this.activeIndex) {
      this.setActive(index);
    }
  }

  private setupAnimations(): void {
    gsap.fromTo('.svc2',
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.svc2', start: 'top 90%' }
      }
    );

    gsap.fromTo('.svc2__headline',
      { y: 80, opacity: 0, skewY: 5 },
      {
        y: 0, opacity: 1, skewY: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.svc2__header', start: 'top 80%' }
      }
    );

    gsap.fromTo('.svc2__eyebrow',
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.svc2__header', start: 'top 85%' }
      }
    );

    gsap.fromTo('.svc2__item',
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc2__list', start: 'top 85%' }
      }
    );

    gsap.fromTo('.svc2__preview',
      { rotateY: 30, x: 50, opacity: 0 },
      {
        rotateY: 0, x: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc2__preview', start: 'top 85%' }
      }
    );

    gsap.to('.svc2__marquee-track', {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1
    });
  }

  private initTyping(): void {
    const text = 'Everything you need to thrive.';
    const el   = document.getElementById('svc2-typed');
    if (!el) return;

    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, 70);
      } else {
        setTimeout(() => el.classList.add('done'), 800);
      }
    };
    setTimeout(type, 400);
  }

  private initCounters(): void {
    const targets = [
      { id: 'svc2-stat-clients',  end: 120,  suffix: '+' },
      { id: 'svc2-stat-projects', end: 340,  suffix: '+' },
      { id: 'svc2-stat-uptime',   end: 99.9, suffix: '%', decimals: 1 },
    ];

    const animate = (el: HTMLElement, end: number, suffix: string, decimals = 0) => {
      const duration = 1800;
      const start    = performance.now();

      const step = (now: number) => {
        const t    = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val  = ease * end;
        el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toString()) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const section = document.getElementById('services');
    if (!section) return;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        targets.forEach(t => {
          const el = document.getElementById(t.id);
          if (el) animate(el, t.end, t.suffix, t.decimals);
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });

    obs.observe(section);
  }

  private initOctahedron(): void {
    const container = document.getElementById('svc2-canvas');
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const mat = new THREE.MeshPhysicalMaterial({
      color:              0x00A3FF,
      metalness:          0.1,
      roughness:          0.05,
      transmission:       0.9,
      thickness:          0.5,
      clearcoat:          1,
      clearcoatRoughness: 0.1,
      transparent:        true,
      opacity:            0.8,
      ior:                1.5,
      side:               THREE.DoubleSide,
    });

    const geo      = new THREE.OctahedronGeometry(1.5, 0);
    const mesh     = new THREE.Mesh(geo, mat);
    const wireMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.52, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 })
    );
    mesh.add(wireMesh);
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl1 = new THREE.PointLight(0x00A3FF, 2, 50); pl1.position.set( 5,  5,  5); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xffffff, 1, 50); pl2.position.set(-5, -5,  5); scene.add(pl2);
    const pl3 = new THREE.PointLight(0x80deea, 1.5, 50); pl3.position.set(0,  5, -5); scene.add(pl3);

    let mouseX = 0, mouseY = 0, time = 0;

    document.addEventListener('mousemove', (e: MouseEvent) => {
      mouseX =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const loop = () => {
      requestAnimationFrame(loop);
      time += 0.01;

      mesh.rotation.x += 0.005 + (mouseY * 0.5 - mesh.rotation.x) * 0.05;
      mesh.rotation.y += 0.008 + (mouseX * 0.5 - mesh.rotation.y) * 0.05;
      mesh.rotation.z += 0.002;
      mesh.position.y  = Math.sin(time) * 0.2;

      const s = 1 + Math.sin(time * 0.5) * 0.02;
      mesh.scale.set(s, s, s);

      renderer.render(scene, camera);
    };
    loop();

    window.addEventListener('resize', () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
  }
}