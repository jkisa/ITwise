export const heroVertex = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vElevation;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float noise = snoise(vec2(pos.x * 0.4 + uTime * 0.15, pos.y * 0.4 + uTime * 0.1));
    float wave = sin(pos.x * 2.5 + uTime * 0.8) * cos(pos.y * 2.5 + uTime * 0.6) * 0.25;
    float mouseDist = distance(uv, uMouse);
    float mouseEffect = smoothstep(0.35, 0.0, mouseDist) * 0.6;
    vElevation = wave + noise * 0.35 + mouseEffect;
    pos.z += vElevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const heroFragment = `
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vec3 white = vec3(0.96, 0.98, 1.0);
    vec3 blue = vec3(0.1, 0.36, 1.0);
    vec3 teal = vec3(0.0, 0.76, 0.66);
    
    float mixVal = smoothstep(-0.6, 1.0, vElevation);
    vec3 color = mix(white, blue, mixVal);
    color = mix(color, teal, smoothstep(0.3, 0.9, mixVal) * 0.7);
    
    float gridX = step(0.97, fract(vUv.x * 50.0));
    float gridY = step(0.97, fract(vUv.y * 50.0));
    float grid = max(gridX, gridY);
    color = mix(color, vec3(1.0), grid * 0.6);
    
    float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                 smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
                 
    gl_FragColor = vec4(color, 0.45 * edge + 0.08);
  }
`

export const particleVertex = `
  uniform float uTime;
  uniform float uScroll;
  attribute float aSize;
  attribute vec3 aRandom;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float t = uTime * 0.3;
    pos.x += sin(t * aRandom.x + aRandom.y) * 0.8;
    pos.y += cos(t * aRandom.y + aRandom.z) * 0.8;
    pos.z += sin(t * aRandom.z) * 0.5;
    
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (30.0 / -mv.z) * (1.0 + uScroll * 0.5);
    vAlpha = 0.6 + 0.4 * sin(t + aRandom.x * 6.28);
  }
`

export const particleFragment = `
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float glow = 1.0 - (d * 2.0);
    glow = pow(glow, 2.0);
    vec3 color = mix(vec3(0.1, 0.36, 1.0), vec3(0.0, 0.76, 0.66), gl_PointCoord.y);
    gl_FragColor = vec4(color, glow * vAlpha * 0.8);
  }
`

export const glitchVertex = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = distance(uv, uMouse);
    float wave = sin(pos.x * 8.0 + uTime * 2.0) * cos(pos.z * 8.0 + uTime * 1.5) * 0.15;
    float hover = smoothstep(0.3, 0.0, dist) * 1.2;
    pos.y += wave + hover;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const glitchFragment = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vec3 blue = vec3(0.1, 0.36, 1.0);
    vec3 teal = vec3(0.0, 0.76, 0.66);
    vec3 white = vec3(1.0);
    
    float scan = step(0.98, fract(vUv.y * 40.0 + uTime * 0.5));
    float grid = step(0.96, fract(vUv.x * 20.0)) + step(0.96, fract(vUv.y * 20.0));
    
    vec3 color = mix(blue, teal, sin(vPos.x * 2.0 + uTime) * 0.5 + 0.5);
    color = mix(color, white, scan * 0.4);
    color = mix(color, vec3(0.9), grid * 0.3);
    
    float edge = 1.0 - abs(vUv.x - 0.5) * 1.8;
    edge *= 1.0 - abs(vUv.y - 0.5) * 1.8;
    
    gl_FragColor = vec4(color, 0.35 * edge);
  }
`

export const chromaticVertex = `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

export const chromaticFragment = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;

  void main() {
    float fresnel = pow(1.0 - dot(vNormal, vView), 3.0);
    vec3 blue = vec3(0.1, 0.36, 1.0);
    vec3 teal = vec3(0.0, 0.76, 0.66);
    vec3 purple = vec3(0.42, 0.23, 0.78);
    
    vec3 color = mix(blue, teal, sin(vUv.y * 3.14 + uTime) * 0.5 + 0.5);
    color = mix(color, purple, fresnel * 0.5);
    
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    color += vec3(0.4, 0.8, 1.0) * rim * 0.8;
    
    gl_FragColor = vec4(color, 0.25 + fresnel * 0.3);
  }
`

export const rippleVertex = `
  uniform float uTime;
  uniform vec3 uRipples[6];
  varying float vElevation;
  varying vec2 vUv;

  float getRipple(vec2 pos, vec3 ripple) {
    float dist = distance(pos, ripple.xy);
    float t = ripple.z;
    float radius = t * 3.0;
    float strength = exp(-t * 1.5) * 0.4;
    float wave = sin(dist * 15.0 - t * 10.0) * strength;
    return wave * smoothstep(radius, 0.0, dist);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation = 0.0;
    for (int i = 0; i < 6; i++) {
      elevation += getRipple(uv, uRipples[i]);
    }
    pos.z += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const rippleFragment = `
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vec3 white = vec3(0.98, 0.99, 1.0);
    vec3 blue = vec3(0.1, 0.36, 1.0);
    vec3 teal = vec3(0.0, 0.76, 0.66);
    
    float mixVal = smoothstep(-0.3, 0.5, vElevation);
    vec3 color = mix(white, blue, mixVal);
    color = mix(color, teal, smoothstep(0.1, 0.4, mixVal));
    
    float grid = step(0.98, fract(vUv.x * 30.0)) + step(0.98, fract(vUv.y * 30.0));
    color = mix(color, vec3(1.0), grid * 0.4);
    
    gl_FragColor = vec4(color, 0.4 + abs(vElevation) * 2.0);
  }
`