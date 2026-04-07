import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('headline')   headlineRef!: ElementRef;
  @ViewChild('subtext')    subtextRef!: ElementRef;
  @ViewChild('actions')    actionsRef!: ElementRef;
  @ViewChild('nav')        navRef!: ElementRef;
  @ViewChild('eyebrow')    eyebrowRef!: ElementRef;

  private platformId = inject(PLATFORM_ID);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animId!: number;
  private mouse  = new THREE.Vector2();
  private target = new THREE.Vector2();
  private spheres: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];
  private mainGroup!: THREE.Group;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initThree();
    this.buildScene();
    this.animate();
    this.animateIn();
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize',    this.onResize);
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.set(0, 0, 8);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  private buildScene(): void {
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    const pmremGen = new THREE.PMREMGenerator(this.renderer);
    const envTex   = pmremGen.fromScene(new RoomEnvironment()).texture;
    this.scene.environment = envTex;
    pmremGen.dispose();

    const configs: [number, number, number, number, number, number, number, number][] = [
      [ 2.5,  0.5,  0,    1.1,  0xffffff, 0.95, 0.03, 1.0],
      [-2.0,  1.2, -1,    0.75, 0xc0c0ff, 0.90, 0.05, 0.9],
      [ 3.5, -1.5, -2,    0.55, 0xff80ff, 0.85, 0.08, 1.0],
      [-3.2, -0.8,  0.5,  0.9,  0x80ffff, 0.92, 0.04, 0.8],
      [ 0.8,  2.5, -1.5,  0.45, 0xffffff, 0.98, 0.02, 1.0],
      [-1.0, -2.2,  1,    0.65, 0xd0aaff, 0.88, 0.06, 0.95],
      [ 4.5,  1.0, -3,    0.35, 0xaaffee, 0.90, 0.05, 1.0],
      [-4.0,  2.0, -2,    0.5,  0xffaacc, 0.85, 0.07, 0.85],
      [ 1.5, -3.0, -1,    0.4,  0xffffff, 0.95, 0.03, 1.0],
    ];

    configs.forEach(([x, y, z, r, col, met, rou, iri], i) => {
      const geo = new THREE.SphereGeometry(r, 64, 64);
      const mat = new THREE.MeshPhysicalMaterial({
        color: col,
        metalness: met,
        roughness: rou,
        iridescence: iri,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [100, 800],
        reflectivity: 1,
        envMapIntensity: 2.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.mainGroup.add(mesh);
      this.spheres.push({ mesh, speed: 0.3 + i * 0.08, offset: i * 1.1 });
    });

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const lights: [number, number, number, number, number][] = [
      [0x7c3aed, 6,  3,  3,  4],
      [0x06b6d4, 5, -2,  3,  3],
      [0xf472b6, 4,  0, -2,  3],
      [0x4af0c4, 3, -3, -3,  5],
      [0x818cf8, 5,  4, -1,  4],
    ];
    lights.forEach(([color, intensity, x, y, z]) => {
      const light = new THREE.PointLight(color, intensity, 20);
      light.position.set(x, y, z);
      this.scene.add(light);
    });
  }

  private animate(): void {
    const t = Date.now() * 0.001;
    this.spheres.forEach(({ mesh, speed, offset }) => {
      mesh.position.y += Math.sin(t * speed + offset) * 0.003;
      mesh.rotation.x += 0.002;
      mesh.rotation.z += 0.001;
    });
    this.target.x += (this.mouse.x * 0.8 - this.target.x) * 0.05;
    this.target.y += (this.mouse.y * 0.5 - this.target.y) * 0.05;
    this.mainGroup.rotation.y = this.target.x * 0.15;
    this.mainGroup.rotation.x = -this.target.y * 0.1;
    this.mainGroup.rotation.y += 0.0015;
    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(() => this.animate());
  }

  private animateIn(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(this.navRef.nativeElement,      { y: -30, opacity: 0, duration: 1   }, 0)
      .from(this.eyebrowRef.nativeElement,  { y:  20, opacity: 0, duration: 0.8 }, 0.3)
      .from(this.headlineRef.nativeElement, { y:  50, opacity: 0, duration: 1   }, 0.45)
      .from(this.subtextRef.nativeElement,  { y:  30, opacity: 0, duration: 0.8 }, 0.65)
      .from(this.actionsRef.nativeElement,  { y:  20, opacity: 0, duration: 0.7 }, 0.8);

    this.spheres.forEach(({ mesh }, i) => {
      const origin = mesh.position.clone();
      mesh.position.multiplyScalar(3);
      gsap.to(mesh.position, {
        x: origin.x, y: origin.y, z: origin.z,
        duration: 1.8,
        delay: 0.1 + i * 0.08,
        ease: 'expo.out'
      });
    });
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  };

  private onResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animId);
    this.renderer.dispose();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize',    this.onResize);
  }
}