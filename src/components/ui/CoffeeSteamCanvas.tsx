"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CoffeeSteamCanvasProps {
  ribbonCount?: number;
  className?: string;
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uSpeed;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float rise = uv.y;
    float t = uTime * uSpeed;

    // Organic rising steam S-curve curl
    float swayA = sin(rise * 4.8 - t + uSeed) * (0.28 + rise * 0.72);
    float swayB = cos(rise * 2.7 - t * 0.65 + uSeed * 1.9) * (0.15 + rise * 0.35);

    // Gentle cursor breeze bending the rising steam
    float breeze = uMouse.x * 1.15 * smoothstep(0.05, 0.9, rise);
    float lift = uMouse.y * 0.35 * smoothstep(0.1, 0.85, rise);

    // 3D ribbon twist for volumetric depth
    float twistAngle = sin(rise * 3.4 - t * 0.85 + uSeed) * 0.85;
    float cosA = cos(twistAngle);
    float sinA = sin(twistAngle);
    float twistedX = pos.x * cosA;
    float twistedZ = pos.x * sinA;

    pos.x = twistedX + swayA + swayB + breeze;
    pos.y += lift;
    pos.z += twistedZ + cos(rise * 3.2 - t * 0.7 + uSeed) * 0.45;

    vWave = sin(rise * 6.0 - t * 1.3 + uSeed) * 0.5 + 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    // Slim, airy ribbon cross-section
    float across = sin(vUv.x * 3.14159265);
    float softBody = pow(max(across, 0.0), 2.6);

    // Delicate editorial etching hairlines woven into the steam
    float strandA = 1.0 - smoothstep(0.0, 0.028, abs(vUv.x - 0.36 - sin(vUv.y * 7.0 - uTime * 1.1 + uSeed) * 0.04));
    float strandB = 1.0 - smoothstep(0.0, 0.022, abs(vUv.x - 0.64 + cos(vUv.y * 6.0 - uTime * 0.9 + uSeed) * 0.04));
    float strands = (strandA + strandB) * 0.45;

    // Smooth vertical fade in at bottom & dissipate at top
    float verticalFade = smoothstep(0.0, 0.22, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));

    // Rising wisp density modulation
    float wisp = 0.68 + 0.32 * sin(vUv.y * 10.0 - uTime * 1.4 + uSeed);

    vec3 color = mix(uColorA, uColorB, clamp(vWave * 0.65 + strands * 0.4, 0.0, 1.0));
    float alpha = (softBody * 0.55 + strands * 0.45) * verticalFade * wisp * uOpacity;

    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function CoffeeSteamCanvas({
  ribbonCount = 7,
  className = "",
}: CoffeeSteamCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 50);
    camera.position.set(0, 0, 9.5);

    const sharedGeometry = new THREE.PlaneGeometry(0.68, 11.5, 16, 72);
    const materials: THREE.ShaderMaterial[] = [];
    const meshes: THREE.Mesh[] = [];

    const coffeeBrown = new THREE.Color("#795548");
    const darkEspresso = new THREE.Color("#3B2923");
    const vintageInk = new THREE.Color("#171717");

    for (let i = 0; i < ribbonCount; i++) {
      const t = ribbonCount > 1 ? i / (ribbonCount - 1) : 0.5;
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: i * 1.9 + 0.7 },
          uSpeed: { value: 0.65 + (i % 3) * 0.16 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uOpacity: { value: 0.1 + (i % 2) * 0.04 },
          uColorA: { value: i % 2 === 0 ? coffeeBrown : darkEspresso },
          uColorB: { value: i % 3 === 0 ? vintageInk : coffeeBrown },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(sharedGeometry, mat);
      // Spread ribbons across the banner width with staggered depth
      mesh.position.x = (t - 0.5) * 14.5 + Math.sin(i * 2.1) * 0.6;
      mesh.position.y = -0.2 + Math.cos(i * 1.7) * 0.4;
      mesh.position.z = -2.2 + (i % 4) * 0.85;
      mesh.rotation.y = (t - 0.5) * 0.35;
      mesh.scale.x = 0.65 + (i % 3) * 0.18;

      scene.add(mesh);
      materials.push(mat);
      meshes.push(mesh);
    }

    const targetMouse = new THREE.Vector2(0, 0);
    const smoothedMouse = new THREE.Vector2(0, 0);

    const handlePointerMove = (e: PointerEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      renderer.render(scene, camera);
    }

    let animationFrameId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const animate = (now: number) => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (!isVisible) {
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      smoothedMouse.lerp(targetMouse, 0.05);

      for (let i = 0; i < materials.length; i++) {
        materials[i].uniforms.uTime.value = elapsed;
        materials[i].uniforms.uMouse.value.copy(smoothedMouse);
      }

      renderer.render(scene, camera);
    };

    if (!reducedMotion) {
      animationFrameId = window.requestAnimationFrame(animate);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      sharedGeometry.dispose();
      for (const mat of materials) {
        mat.dispose();
      }
      for (const mesh of meshes) {
        scene.remove(mesh);
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [ribbonCount]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
