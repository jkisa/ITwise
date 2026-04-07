import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CrystalNode {
  mesh: THREE.Mesh;
  originalColor: THREE.Color;
  id: number;
  basePos: { x: number; y: number; z: number };
  floatSpeed: number;
  rotSpeed: number;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class ThreeBackgroundService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animId!: number;
  private mouse = new THREE.Vector2();
  private targetCameraPos = new THREE.Vector3(0, 0, 10); // CLOSER to camera
  
  private groups: THREE.Group[] = [];
  private currentGroup = 0;
  private crystalNodes: CrystalNode[] = [];
  
  // Cool iridescent palette
  private colors = {
    ice: 0xf0f9ff,
    cyan: 0x22d3ee,
    sky: 0x0ea5e9,
    blue: 0x3b82f6,
    silver: 0xc0c7d0,
    indigo: 0x6366f1,
    violet: 0x8b5cf6,
    teal: 0x14b8a6
  };

  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.setupRenderer(canvas);
    this.buildLights();
    
    this.buildHeroScene();      // LARGER, more prominent orbs
    this.buildAboutScene();     // SERVER STACK - three glass rectangles
    this.buildServicesScene();  // 7 symbolic shapes - LARGER
    this.buildContactScene();   // LARGER crystal formation
    
    this.setupScrollMorphing();
    this.loop();
    
    window.addEventListener('mousemove', this.onMouse);
    window.addEventListener('resize', this.onResize);
  }

  private setupRenderer(canvas: HTMLCanvasElement): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06060f);
    
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 10); // CLOSER camera

    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4; // BRIGHTER

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
    pmrem.dispose();
  }

  private buildLights(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5)); // BRIGHTER ambient
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);
    
    // Stronger accent lights
    const colors = [0x22d3ee, 0x3b82f6, 0x8b5cf6, 0xf0f9ff, 0x0ea5e9];
    colors.forEach((color, i) => {
      const light = new THREE.PointLight(color, 12, 60); // STRONGER lights
      const angle = (i / 5) * Math.PI * 2;
      light.position.set(Math.cos(angle) * 8, Math.sin(angle) * 6, 5); // CLOSER lights
      this.scene.add(light);
    });
  }

  private createBubbleGlassMaterial(color: number): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.05,
      roughness: 0.02, // SMOOTHER
      transmission: 0.98, // MORE transparent
      thickness: 4, // THICKER glass for more refraction
      ior: 1.5,
      iridescence: 1,
      iridescenceIOR: 2.5, // STRONGER rainbow effect
      iridescenceThicknessRange: [200, 800],
      clearcoat: 1,
      clearcoatRoughness: 0.01,
      envMapIntensity: 4, // STRONGER reflections
      attenuationColor: new THREE.Color(color),
      attenuationDistance: 3
    });
  }

  // ===== HERO: LARGE PROMINENT ORBS =====
  private buildHeroScene(): void {
    const group = new THREE.Group();
    group.name = 'HERO';
    
    // LARGER orbs, CLOSER to camera
    const orbs = [
      { x: 2, y: 1.5, z: -1, r: 2.2, color: this.colors.ice },      // BIG ice sphere
      { x: -2.5, y: 2.5, z: -2, r: 1.6, color: this.colors.cyan },  // LARGE cyan
      { x: 3.5, y: -1.5, z: -3, r: 1.2, color: this.colors.sky },   // Medium sky
      { x: -3, y: -2, z: -1, r: 1.4, color: this.colors.silver },   // Large silver
      { x: 0, y: 3, z: -4, r: 0.9, color: this.colors.blue },       // Small blue accent
    ];
    
    orbs.forEach((cfg, i) => {
      const geo = new THREE.SphereGeometry(cfg.r, 128, 128); // HIGHER RESOLUTION
      const mat = this.createBubbleGlassMaterial(cfg.color);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      
      // Energy ring
      const ringGeo = new THREE.TorusGeometry(cfg.r * 1.4, 0.02, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: cfg.color, 
        transparent: true, 
        opacity: 0.4 // MORE visible
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      mesh.add(ring);
      
      mesh.userData = { 
        baseY: cfg.y, 
        speed: 0.3 + i * 0.1,
        offset: i * 1.2,
        ring: ring
      };
      
      group.add(mesh);
    });
    
    this.addParticles(group, 80, 0x22d3ee, 0.4);
    
    group.visible = true;
    this.scene.add(group);
    this.groups.push(group);
  }

  // ===== ABOUT: SERVER STACK - Three Glass Rectangles =====
  private buildAboutScene(): void {
    const group = new THREE.Group();
    group.name = 'ABOUT';
    
    // THREE TRANSLUCENT GLASS RECTANGLES - Server Stack
    // Like abstract server racks made of iridescent bubble glass
    const servers = [
      { 
        y: 3.2, 
        color: this.colors.cyan, 
        w: 3.0, h: 1.2, d: 1.8, // WIDER, TALLER
        label: 'Strategy Layer'
      },
      { 
        y: 0, 
        color: this.colors.blue, 
        w: 3.4, h: 1.2, d: 1.8, // LARGEST (middle)
        label: 'Integration Layer'
      },
      { 
        y: -3.2, 
        color: this.colors.ice, 
        w: 3.0, h: 1.2, d: 1.8,
        label: 'Operations Layer'
      }
    ];
    
    servers.forEach((srv, i) => {
      // Rounded box for bubble glass look
      const geo = new THREE.BoxGeometry(srv.w, srv.h, srv.d, 8, 8, 8);
      const mat = this.createBubbleGlassMaterial(srv.color);
      const mesh = new THREE.Mesh(geo, mat);
      
      // Position: CENTERED and CLOSER
      mesh.position.set(0, srv.y, -2);
      
      // GLOWING EDGES - more prominent
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: srv.color, 
        transparent: true, 
        opacity: 0.8 // STRONGER glow
      });
      const edgesMesh = new THREE.LineSegments(edges, lineMat);
      mesh.add(edgesMesh);
      
      // Internal glow plane (like server lights)
      const lightGeo = new THREE.PlaneGeometry(srv.w * 0.8, srv.h * 0.2);
      const lightMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const lightPanel = new THREE.Mesh(lightGeo, lightMat);
      lightPanel.position.z = srv.d / 2 + 0.01;
      mesh.add(lightPanel);
      
      // Data flow particles between servers
      if (i < servers.length - 1) {
        const flowGeo = new THREE.BufferGeometry();
        const flowCount = 30;
        const positions = new Float32Array(flowCount * 3);
        for (let j = 0; j < flowCount; j++) {
          positions[j*3] = (Math.random() - 0.5) * srv.w * 0.8;
          positions[j*3+1] = srv.y - 0.8 - Math.random() * 1.5;
          positions[j*3+2] = (Math.random() - 0.5) * 0.5;
        }
        flowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const flowMat = new THREE.PointsMaterial({ 
          color: 0xffffff, size: 0.06, transparent: true, opacity: 0.9 // BRIGHTER
        });
        const flow = new THREE.Points(flowGeo, flowMat);
        flow.userData = { isFlow: true, baseY: srv.y - 0.8 };
        mesh.add(flow);
      }
      
      mesh.userData = { 
        baseY: srv.y, 
        offset: i * 2,
        speed: 0.3 + i * 0.1,
        label: srv.label
      };
      
      group.add(mesh);
    });
    
    // Floating data fragments around stack
    for (let i = 0; i < 6; i++) {
      const fragGeo = new THREE.OctahedronGeometry(0.2 + Math.random() * 0.3, 0);
      const fragMat = this.createBubbleGlassMaterial(this.colors.sky);
      const frag = new THREE.Mesh(fragGeo, fragMat);
      frag.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10,
        -3 + (Math.random() - 0.5) * 4
      );
      frag.userData = { 
        floatSpeed: 0.5 + Math.random() * 0.5,
        rotSpeed: 0.02
      };
      group.add(frag);
    }
    
    group.visible = false;
    this.scene.add(group);
    this.groups.push(group);
  }

  // ===== SERVICES: 7 LARGE SYMBOLIC SHAPES =====
  private buildServicesScene(): void {
    const group = new THREE.Group();
    group.name = 'SERVICES';
    
    // LARGER shapes, CLOSER to camera
    const services = [
      { 
        id: 0, name: 'Security', color: this.colors.violet,
        x: -4, y: 3, z: 0,
        geometry: new THREE.ConeGeometry(0.9, 1.8, 4), // BIGGER pyramid
        type: 'pyramid'
      },
      { 
        id: 1, name: 'Software', color: this.colors.cyan,
        x: -1.5, y: 4, z: 1,
        geometry: new THREE.SphereGeometry(1.0, 64, 64), // BIGGER sphere
        type: 'sphere'
      },
      { 
        id: 2, name: 'Infrastructure', color: this.colors.blue,
        x: 1.5, y: 3.2, z: -1,
        geometry: new THREE.BoxGeometry(1.4, 1.4, 1.4), // BIGGER cube
        type: 'cube'
      },
      { 
        id: 3, name: 'Support', color: this.colors.teal,
        x: 4, y: 4, z: 0,
        geometry: new THREE.TorusGeometry(0.8, 0.35, 16, 100), // BIGGER torus
        type: 'torus'
      },
      { 
        id: 4, name: 'Analytics', color: this.colors.indigo,
        x: -3, y: 0, z: 1,
        geometry: new THREE.DodecahedronGeometry(1.0), // BIGGER
        type: 'dodecahedron'
      },
      { 
        id: 5, name: 'Integration', color: this.colors.sky,
        x: 0, y: 0.5, z: -2,
        geometry: new THREE.OctahedronGeometry(1.1), // BIGGER
        type: 'octahedron'
      },
      { 
        id: 6, name: 'Online Support', color: this.colors.ice,
        x: 3, y: 0, z: 0,
        geometry: new THREE.IcosahedronGeometry(1.0, 0), // BIGGER
        type: 'icosahedron'
      }
    ];
    
    services.forEach(service => {
      const mat = this.createBubbleGlassMaterial(service.color);
      const mesh = new THREE.Mesh(service.geometry, mat);
      mesh.position.set(service.x, service.y, service.z);
      
      // Specific rotations
      if (service.type === 'pyramid') mesh.rotation.x = Math.PI;
      if (service.type === 'torus') mesh.rotation.x = Math.PI / 2;
      
      // BRIGHTER wireframe
      let wireGeo = service.type === 'sphere' 
        ? new THREE.WireframeGeometry(service.geometry)
        : new THREE.EdgesGeometry(service.geometry);
      
      const wireMat = new THREE.LineBasicMaterial({
        color: service.color,
        transparent: true,
        opacity: 0.4 // MORE visible
      });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe);
      
      mesh.userData = {
        id: service.id,
        name: service.name,
        type: service.type,
        basePos: { x: service.x, y: service.y, z: service.z },
        floatSpeed: 0.4 + service.id * 0.06,
        rotSpeed: 0.01,
        wireframe: wireframe
      };
      
      group.add(mesh);
      
      this.crystalNodes.push({
        mesh,
        originalColor: new THREE.Color(service.color),
        id: service.id,
        basePos: { x: service.x, y: service.y, z: service.z },
        floatSpeed: 0.4 + service.id * 0.06,
        rotSpeed: 0.01,
        type: service.type
      });
    });
    
    // Constellation lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2 // MORE visible
    });
    
    for (let i = 0; i < services.length - 1; i++) {
      const pts = [
        new THREE.Vector3(services[i].x, services[i].y, services[i].z),
        new THREE.Vector3(services[i+1].x, services[i+1].y, services[i+1].z)
      ];
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        lineMat
      );
      group.add(line);
    }
    
    this.addParticles(group, 120, 0x60a5fa, 0.3);
    
    group.visible = false;
    this.scene.add(group);
    this.groups.push(group);
  }

  // ===== CONTACT: LARGE CRYSTAL =====
  private buildContactScene(): void {
    const group = new THREE.Group();
    group.name = 'CONTACT';
    
    // TALLER crystal
    const crystalGeo = new THREE.ConeGeometry(1.8, 6, 8); // BIGGER
    const crystalMat = this.createBubbleGlassMaterial(this.colors.ice);
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(0, 0, -2);
    crystal.rotation.z = Math.PI;
    crystal.userData = { rotSpeed: 0.01 };
    group.add(crystal);
    
    // Orbiting crystals
    const orbits = [
      { r: 0.5, dist: 3.5, speed: 1.2, color: this.colors.cyan },
      { r: 0.4, dist: 4.5, speed: 0.8, color: this.colors.blue },
      { r: 0.45, dist: 4, speed: 1.0, color: this.colors.sky }
    ];
    
    orbits.forEach((cfg, i) => {
      const geo = new THREE.OctahedronGeometry(cfg.r, 0);
      const mat = this.createBubbleGlassMaterial(cfg.color);
      const mesh = new THREE.Mesh(geo, mat);
      
      const angle = (i / 3) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * cfg.dist,
        Math.sin(angle) * cfg.dist * 0.5,
        -2 + Math.sin(angle) * cfg.dist * 0.3
      );
      
      mesh.userData = {
        orbitSpeed: cfg.speed,
        orbitOffset: angle,
        orbitDist: cfg.dist,
        centerX: 0,
        centerZ: -2
      };
      
      group.add(mesh);
    });
    
    group.visible = false;
    this.scene.add(group);
    this.groups.push(group);
  }

  private addParticles(group: THREE.Group, count: number, color: number, opacity: number): void {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random() - 0.5) * 20;
      pos[i*3+1] = (Math.random() - 0.5) * 16;
      pos[i*3+2] = (Math.random() - 0.5) * 10;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    const mat = new THREE.PointsMaterial({
      color: color,
      size: 0.06, // LARGER particles
      transparent: true,
      opacity: opacity,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geo, mat);
    group.add(particles);
  }

  highlightService(index: number, active: boolean): void {
    const node = this.crystalNodes.find(n => n.id === index);
    if (!node) return;
    
    const mesh = node.mesh;
    const material = mesh.material as THREE.MeshPhysicalMaterial;
    
    if (active) {
      gsap.to(mesh.scale, {
        x: 2.0, y: 2.0, z: 2.0, // SCALE UP MORE
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
      
      gsap.to(material, {
        emissive: node.originalColor,
        emissiveIntensity: 1.0, // BRIGHTER glow
        transmission: 0.6,
        duration: 0.3
      });
      
      mesh.userData['rotSpeed'] = 0.08;
      
      const wireframe = mesh.userData['wireframe'];
      if (wireframe) {
        gsap.to(wireframe.material, { opacity: 0.9, duration: 0.3 }); // FULL brightness
      }
      
      gsap.to(mesh.position, {
        y: node.basePos.y + 0.8,
        duration: 0.4,
        yoyo: true,
        repeat: 1
      });
      
    } else {
      gsap.to(mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      gsap.to(material, {
        emissiveIntensity: 0,
        transmission: 0.98,
        duration: 0.4
      });
      
      mesh.userData['rotSpeed'] = 0.01;
      
      const wireframe = mesh.userData['wireframe'];
      if (wireframe) {
        gsap.to(wireframe.material, { opacity: 0.4, duration: 0.3 });
      }
    }
  }

  private setupScrollMorphing(): void {
    const sections = ['#hero', '#about', '#services', '#contact'];
    
    sections.forEach((selector, index) => {
      const el = document.querySelector(selector);
      if (!el) return;
      
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => this.transitionToGroup(index),
        onEnterBack: () => this.transitionToGroup(index)
      });
    });
  }

  private transitionToGroup(index: number): void {
    if (this.currentGroup === index) return;
    
    const outGroup = this.groups[this.currentGroup];
    const inGroup = this.groups[index];
    
    if (!inGroup) return;
    
    console.log(`🔄 Transition: ${outGroup?.name || 'none'} → ${inGroup.name}`);
    
    if (outGroup) {
      gsap.to(outGroup.scale, {
        x: 0.8, y: 0.8, z: 0.8,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          outGroup.visible = false;
          outGroup.scale.set(1, 1, 1);
        }
      });
    }
    
    inGroup.visible = true;
    inGroup.scale.set(0.8, 0.8, 0.8);
    
    gsap.to(inGroup.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)'
    });
    
    // CLOSER camera positions
    const cameraTargets = [
      new THREE.Vector3(0, 0, 8),      // Hero: very close
      new THREE.Vector3(0, 0, 10),     // About: close to server stack
      new THREE.Vector3(0, 1, 12),     // Services: close to shapes
      new THREE.Vector3(0, 0, 10)      // Contact: close
    ];
    
    gsap.to(this.targetCameraPos, {
      x: cameraTargets[index].x,
      y: cameraTargets[index].y,
      z: cameraTargets[index].z,
      duration: 1.2,
      ease: 'power3.inOut'
    });
    
    this.currentGroup = index;
  }

  private loop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const time = performance.now() / 1000;
    const group = this.groups[this.currentGroup];
    
    if (group && group.visible) {
      group.children.forEach((child: any) => {
        if (!child.isMesh && !child.isPoints && !child.isLine) return;
        
        const data = child.userData || {};
        
        // ABOUT: Server stack floating
        if (group.name === 'ABOUT' && data['baseY'] !== undefined && !data['isFlow']) {
          child.position.y = data['baseY'] + Math.sin(time * data['speed'] + data['offset']) * 0.2;
          child.rotation.y += 0.005;
          child.rotation.x = Math.sin(time * 0.2 + data['offset']) * 0.02;
        }
        else if (group.name === 'ABOUT' && data['floatSpeed']) {
          // Floating fragments
          child.position.y += Math.sin(time * data['floatSpeed']) * 0.01;
          child.rotation.x += data['rotSpeed'];
          child.rotation.y += data['rotSpeed'] * 0.5;
        }
        else if (group.name === 'SERVICES' && data['basePos']) {
          const speed = data['floatSpeed'] || 0.5;
          const base = data['basePos'];
          child.position.y = base.y + Math.sin(time * speed + data['id']) * 0.25;
          child.position.x = base.x + Math.cos(time * speed * 0.7 + data['id']) * 0.15;
          child.rotation.x += 0.003;
          child.rotation.y += data['rotSpeed'] || 0.01;
          
          if (data['type'] === 'torus') {
            child.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.1;
          }
        }
        else if (group.name === 'CONTACT') {
          if (data['orbitSpeed']) {
            const angle = data['orbitOffset'] + time * data['orbitSpeed'] * 0.5;
            child.position.x = data['centerX'] + Math.cos(angle) * data['orbitDist'];
            child.position.z = data['centerZ'] + Math.sin(angle) * data['orbitDist'] * 0.5;
            child.position.y = Math.sin(angle * 2) * 1.5;
          } else if (data['rotSpeed']) {
            child.rotation.y += data['rotSpeed'];
          }
        }
        else if (group.name === 'HERO' && data['baseY'] !== undefined) {
          child.position.y = data['baseY'] + Math.sin(time * data['speed'] + data['offset']) * 0.2;
          child.rotation.y += 0.003;
          if (data['ring']) {
            data['ring'].rotation.z += 0.01;
          }
        }
      });
    }
    
    // Smooth camera
    this.camera.position.x += (this.targetCameraPos.x - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetCameraPos.y - this.camera.position.y) * 0.05;
    this.camera.position.z += (this.targetCameraPos.z - this.camera.position.z) * 0.05;
    this.camera.lookAt(0, 0, 0);
    
    // Mouse parallax
    const targetX = this.mouse.x * 2;
    const targetY = this.mouse.y * 1.5;
    this.camera.position.x += (targetX - this.camera.position.x) * 0.03;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.03;
    
    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(() => this.loop());
  }

  private onMouse = (e: MouseEvent): void => {
    this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  };

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.animId) cancelAnimationFrame(this.animId);
    this.renderer?.dispose();
    window.removeEventListener('mousemove', this.onMouse);
    window.removeEventListener('resize', this.onResize);
  }
}