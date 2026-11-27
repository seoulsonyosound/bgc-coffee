"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface IcedCoffeeModelViewerProps {
  modelUrl?: string;
}

export function IcedCoffeeModelViewer({
  modelUrl = "/models/iced-coffee.glb",
}: IcedCoffeeModelViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 50, y: 20 });
  const touchHideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio IBL environment so PBR glass, ice, and liquid materials reflect naturally
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 5.2);
    camera.lookAt(0, 0, 0);

    // Warm coffee-studio lights
    const ambient = new THREE.AmbientLight(0xfff5e8, 0.75);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd9a066, 1.2);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Master pivot group for smooth orbit & float
    const pivot = new THREE.Group();
    scene.add(pivot);

    // Crooked / tilted holder inside the pivot so the coffee leans playfully as it spins
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = -0.18;
    tiltGroup.rotation.x = 0.08;
    pivot.add(tiltGroup);

    let loadedScene: THREE.Object3D | null = null;
    let isDisposed = false;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;

        // Auto-center and normalize scale so any GLB fits cleanly in frame
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 2.9;
        const scale = targetSize / maxDim;

        model.scale.setScalar(scale);
        model.position.set(
          -center.x * scale,
          -center.y * scale,
          -center.z * scale
        );

        tiltGroup.add(model);
        loadedScene = model;
        setStatus("ready");
      },
      undefined,
      () => {
        if (!isDisposed) {
          setStatus("error");
        }
      }
    );

    // Pointer interaction state
    let pointerDown = false;
    let movedDistance = 0;
    let lastX = 0;
    let lastY = 0;
    let targetRotY = 0.25;
    let targetRotX = 0.06;
    let hoverOffsetX = 0;
    let hoverOffsetY = 0;
    let bounceVel = 0;
    let bounceY = 0;

    const canvasEl = renderer.domElement;
    canvasEl.style.touchAction = "pan-y";

    const updateTooltipFromEvent = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const pctX = THREE.MathUtils.clamp(
        ((e.clientX - rect.left) / rect.width) * 100,
        18,
        82
      );
      const pctY = THREE.MathUtils.clamp(
        ((e.clientY - rect.top) / rect.height) * 100 - 10,
        8,
        86
      );
      setTooltipPos({ x: pctX, y: pctY });
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDown = true;
      movedDistance = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      setIsDragging(true);
      setIsInteracting(true);
      updateTooltipFromEvent(e);
      if (touchHideTimerRef.current !== null) {
        window.clearTimeout(touchHideTimerRef.current);
        touchHideTimerRef.current = null;
      }
      canvasEl.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      setIsInteracting(true);
      updateTooltipFromEvent(e);
      if (pointerDown) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        movedDistance += Math.abs(dx) + Math.abs(dy);
        targetRotY += dx * 0.011;
        targetRotX = THREE.MathUtils.clamp(
          targetRotX + dy * 0.006,
          -0.45,
          0.45
        );
        lastX = e.clientX;
        lastY = e.clientY;
      } else {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        hoverOffsetY = nx * 0.14;
        hoverOffsetX = ny * 0.07;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointerDown && movedDistance < 8) {
        bounceVel = 0.07;
      }
      pointerDown = false;
      setIsDragging(false);
      if (e.pointerType !== "mouse") {
        touchHideTimerRef.current = window.setTimeout(() => {
          setIsInteracting(false);
        }, 1600);
      }
      if (canvasEl.hasPointerCapture(e.pointerId)) {
        canvasEl.releasePointerCapture(e.pointerId);
      }
    };

    const onPointerLeave = () => {
      hoverOffsetX = 0;
      hoverOffsetY = 0;
      if (!pointerDown) {
        setIsInteracting(false);
      }
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("pointercancel", onPointerUp);
    canvasEl.addEventListener("pointerleave", onPointerLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (!pointerDown && !prefersReducedMotion) {
        targetRotY += dt * 0.35;
      }

      bounceY += bounceVel;
      bounceVel += -bounceY * 0.22;
      bounceVel *= 0.82;

      pivot.rotation.y += (targetRotY + hoverOffsetY - pivot.rotation.y) * 0.1;
      pivot.rotation.x += (targetRotX + hoverOffsetX - pivot.rotation.x) * 0.1;

      const floatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.5) * 0.045;
      pivot.position.y = floatY + bounceY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      if (touchHideTimerRef.current !== null) {
        window.clearTimeout(touchHideTimerRef.current);
      }
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerup", onPointerUp);
      canvasEl.removeEventListener("pointercancel", onPointerUp);
      canvasEl.removeEventListener("pointerleave", onPointerLeave);

      if (loadedScene) {
        loadedScene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            const mats = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            mats.forEach((m) => m?.dispose());
          }
        });
      }

      envTexture.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Frameless Transparent 3D Model Canvas */}
      <div className="relative aspect-[4/5] w-full max-w-[440px]">
        <div
          ref={containerRef}
          role="img"
          aria-label="Interactive 3D Barista Drink model — drag to rotate"
          className={`h-full w-full ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        />

        {/* Loading Indicator */}
        {status === "loading" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-[#795548]">
              Brewing 3D Preview...
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {status === "error" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[#795548]">
              Could not load 3D model
            </span>
          </div>
        )}
        {/* Interactive Tooltip: Secret Drink? Barista Drink! */}
        <div
          aria-hidden={!isInteracting}
          style={{
            left: `${tooltipPos.x}%`,
            top: `${tooltipPos.y}%`,
          }}
          className={`pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full border border-[#171717] bg-[#F7F4EE] px-3.5 py-1.5 whitespace-nowrap shadow-[3px_3px_0px_#171717] transition-all duration-200 ${
            isInteracting
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <p className="font-editorial italic text-sm sm:text-base leading-tight text-[#171717]">
            Secret Drink?{" "}
            <span className="not-italic text-[#795548]">Barista Drink!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
