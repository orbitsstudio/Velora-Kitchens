import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ThreeKitchenViewerProps {
  layout: string;
  cabinetFinish: string;
  countertop: string;
  hardware: string;
  lighting: 'morning' | 'golden' | 'evening';
}

export const ThreeKitchenViewer: React.FC<ThreeKitchenViewerProps> = ({
  cabinetFinish,
  countertop,
  hardware,
  lighting
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  // Keep references to dynamic materials for instant live updating without teardown
  const materialsRef = useRef<{
    stoneMaterial: THREE.MeshStandardMaterial;
    cabinetMaterial: THREE.MeshStandardMaterial;
    hardwareMaterial: THREE.MeshStandardMaterial;
    ledMaterial: THREE.MeshBasicMaterial;
    keyLight: THREE.DirectionalLight;
    ambientLight: THREE.HemisphereLight;
    islandGroup: THREE.Group;
  } | null>(null);

  // Helper: Procedural marble canvas texture
  const createMarbleTexture = (stoneName: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    let baseColor = '#F2EFE9';
    let veinColor = '#4B2A3F'; // Calacatta Viola

    if (stoneName.includes('Arabescato')) {
      baseColor = '#EFEFEF';
      veinColor = '#2B2B2B';
    } else if (stoneName.includes('Pietra Grey')) {
      baseColor = '#3A3A38';
      veinColor = '#BEBEBE';
    } else if (stoneName.includes('Taj Mahal')) {
      baseColor = '#D4C7B5';
      veinColor = '#9E8870';
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.filter = 'blur(2px)';

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      let startX = Math.random() * 512;
      let startY = 0;
      ctx.moveTo(startX, startY);
      for (let j = 0; j < 4; j++) {
        startX += (Math.random() - 0.5) * 160;
        startY += 128;
        ctx.quadraticCurveTo(startX + (Math.random() - 0.5) * 80, startY - 60, startX, startY);
      }
      ctx.globalAlpha = 0.5 + Math.random() * 0.3;
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Helper: Procedural fluted wood texture
  const createFlutedWoodTexture = (woodType: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    let bgColor = '#4A3525';
    let stripeColor = '#2B1E15';

    if (woodType.includes('Oak')) {
      bgColor = '#332922';
      stripeColor = '#1F1813';
    } else if (woodType.includes('Nero')) {
      bgColor = '#1A1A1A';
      stripeColor = '#0F0F0F';
    } else if (woodType.includes('Cashmere')) {
      bgColor = '#D1C7BA';
      stripeColor = '#BFB4A5';
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = stripeColor;
    const ribWidth = 8;
    for (let x = 0; x < 256; x += ribWidth * 2) {
      ctx.fillRect(x, 0, ribWidth, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId = 0;
    let stoneTex: THREE.Texture | null = null;
    let woodTex: THREE.Texture | null = null;

    try {
      // Width and height guard
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;
      const aspect = height > 0 ? width / height : 16 / 9;

      // 1. Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x131110);
      scene.fog = new THREE.Fog(0x131110, 10, 28);

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
      camera.position.set(0, 2.8, 6.2);

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // 4. Studio Environment
      try {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        pmremGenerator.dispose();
      } catch {
        // Environment fallback
      }

      // 5. Lighting Rig
      const ambientLight = new THREE.HemisphereLight(0xF5E6D3, 0x1A1512, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xFFF3DD, 2.4);
      keyLight.position.set(4, 6, 4);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xC6A875, 1.5);
      rimLight.position.set(-5, 4, -4);
      scene.add(rimLight);

      // 6. Materials
      stoneTex = createMarbleTexture(countertop);
      const stoneMaterial = new THREE.MeshStandardMaterial({
        map: stoneTex,
        roughness: 0.18,
        metalness: 0.05
      });

      woodTex = createFlutedWoodTexture(cabinetFinish);
      const cabinetMaterial = new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.65,
        metalness: 0.1
      });

      const hardwareMaterial = new THREE.MeshStandardMaterial({
        color: 0xC6A875,
        roughness: 0.25,
        metalness: 0.95
      });

      const ledMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFE090
      });

      const inductionGlassMaterial = new THREE.MeshStandardMaterial({
        color: 0x0A0A0A,
        roughness: 0.05,
        metalness: 0.9
      });

      // 7. Kitchen Island Assembly
      const islandGroup = new THREE.Group();

      // Main Cabinet Core Body
      const coreGeo = new THREE.BoxGeometry(3.6, 0.88, 1.15);
      const coreMesh = new THREE.Mesh(coreGeo, cabinetMaterial);
      coreMesh.position.y = 0.44;
      coreMesh.castShadow = true;
      coreMesh.receiveShadow = true;
      islandGroup.add(coreMesh);

      // Recessed Shadow Gap / Plinth Base
      const plinthGeo = new THREE.BoxGeometry(3.5, 0.06, 1.05);
      const plinthMesh = new THREE.Mesh(plinthGeo, hardwareMaterial);
      plinthMesh.position.y = 0.03;
      islandGroup.add(plinthMesh);

      // Horizontal Gola Channel Profile Handle Line
      const golaGeo = new THREE.BoxGeometry(3.62, 0.03, 1.16);
      const golaMesh = new THREE.Mesh(golaGeo, hardwareMaterial);
      golaMesh.position.y = 0.52;
      islandGroup.add(golaMesh);

      // Top Countertop Slab
      const topGeo = new THREE.BoxGeometry(3.8, 0.08, 1.25);
      const topMesh = new THREE.Mesh(topGeo, stoneMaterial);
      topMesh.position.y = 0.92;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      islandGroup.add(topMesh);

      // Left Waterfall Drop
      const leftDropGeo = new THREE.BoxGeometry(0.08, 0.92, 1.25);
      const leftDropMesh = new THREE.Mesh(leftDropGeo, stoneMaterial);
      leftDropMesh.position.set(-1.86, 0.46, 0);
      leftDropMesh.castShadow = true;
      islandGroup.add(leftDropMesh);

      // Right Waterfall Drop
      const rightDropGeo = new THREE.BoxGeometry(0.08, 0.92, 1.25);
      const rightDropMesh = new THREE.Mesh(rightDropGeo, stoneMaterial);
      rightDropMesh.position.set(1.86, 0.46, 0);
      rightDropMesh.castShadow = true;
      islandGroup.add(rightDropMesh);

      // Flush Ceramic Induction Cooktop
      const inductionGeo = new THREE.BoxGeometry(0.85, 0.005, 0.52);
      const inductionMesh = new THREE.Mesh(inductionGeo, inductionGlassMaterial);
      inductionMesh.position.set(-0.6, 0.963, 0);
      islandGroup.add(inductionMesh);

      // Integrated Undermount Stone Sink
      const sinkGeo = new THREE.BoxGeometry(0.7, 0.005, 0.45);
      const sinkMesh = new THREE.Mesh(sinkGeo, hardwareMaterial);
      sinkMesh.position.set(0.7, 0.963, 0);
      islandGroup.add(sinkMesh);

      // Architectural Minimalist Brass Faucet
      const faucetGroup = new THREE.Group();
      const faucetStemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 16);
      const faucetStem = new THREE.Mesh(faucetStemGeo, hardwareMaterial);
      faucetStem.position.set(0.7, 1.135, -0.2);
      faucetGroup.add(faucetStem);
      const faucetSpoutGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.2, 16);
      const faucetSpout = new THREE.Mesh(faucetSpoutGeo, hardwareMaterial);
      faucetSpout.rotation.z = Math.PI / 2;
      faucetSpout.position.set(0.7, 1.3, -0.1);
      faucetGroup.add(faucetSpout);
      islandGroup.add(faucetGroup);

      // Suspended Architectural Linear Pendant
      const pendantGroup = new THREE.Group();
      const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 1.5), hardwareMaterial);
      wire1.position.set(-0.8, 2.3, 0);
      const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 1.5), hardwareMaterial);
      wire2.position.set(0.8, 2.3, 0);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, 0.03), hardwareMaterial);
      bar.position.set(0, 1.55, 0);
      const ledBar = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.01, 0.02), ledMaterial);
      ledBar.position.set(0, 1.53, 0);
      pendantGroup.add(wire1, wire2, bar, ledBar);
      islandGroup.add(pendantGroup);

      // Soft Contact Shadow Plane Grounding
      const shadowGeo = new THREE.PlaneGeometry(4.6, 2.0);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.55
      });
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.005;
      islandGroup.add(shadowPlane);

      scene.add(islandGroup);

      // Store refs for live prop mutations
      materialsRef.current = {
        stoneMaterial,
        cabinetMaterial,
        hardwareMaterial,
        ledMaterial,
        keyLight,
        ambientLight,
        islandGroup
      };

      // 8. Interactive Mouse Rotation
      let isDragging = false;
      let prevMouseX = 0;
      let targetRotationY = -0.3;
      let currentRotationY = -0.3;
      let targetRotationX = 0.15;
      let currentRotationX = 0.15;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        targetRotationY += deltaX * 0.006;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const domEl = renderer.domElement;
      domEl.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Touch support
      let touchStartX = 0;
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - touchStartX;
          touchStartX = e.touches[0].clientX;
          targetRotationY += deltaX * 0.008;
        }
      };
      domEl.addEventListener('touchstart', onTouchStart, { passive: true });
      domEl.addEventListener('touchmove', onTouchMove, { passive: true });

      // Handle Resize
      const onResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 520;
        if (h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      };
      window.addEventListener('resize', onResize);

      // 9. Render Loop
      const clock = new THREE.Clock();
      const tick = () => {
        const delta = clock.getDelta();

        if (!isDragging) {
          targetRotationY += 0.08 * delta;
        }

        currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 6, delta);
        currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 6, delta);

        islandGroup.rotation.y = currentRotationY;
        islandGroup.rotation.x = currentRotationX;

        renderer?.render(scene, camera);
        animId = requestAnimationFrame(tick);
      };

      animId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(animId);
        domEl.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        domEl.removeEventListener('touchstart', onTouchStart);
        domEl.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onResize);

        renderer?.dispose();
        stoneTex?.dispose();
        woodTex?.dispose();
        if (container.contains(domEl)) {
          container.removeChild(domEl);
        }
      };
    } catch {
      setHasWebGlError(true);
    }
  }, []);

  // Update textures and lighting dynamically when props change
  useEffect(() => {
    if (!materialsRef.current) return;
    const { stoneMaterial, cabinetMaterial, hardwareMaterial, ledMaterial, keyLight, ambientLight } = materialsRef.current;

    stoneMaterial.map = createMarbleTexture(countertop);
    stoneMaterial.needsUpdate = true;

    cabinetMaterial.map = createFlutedWoodTexture(cabinetFinish);
    cabinetMaterial.needsUpdate = true;

    if (hardware.includes('Gunmetal')) {
      hardwareMaterial.color.setHex(0x3E3E3E);
      hardwareMaterial.roughness = 0.35;
    } else if (hardware.includes('Bronze')) {
      hardwareMaterial.color.setHex(0x825838);
      hardwareMaterial.roughness = 0.3;
    } else {
      hardwareMaterial.color.setHex(0xC6A875);
      hardwareMaterial.roughness = 0.22;
    }
    hardwareMaterial.needsUpdate = true;

    if (lighting === 'morning') {
      keyLight.color.setHex(0xFFFFFF);
      keyLight.intensity = 2.8;
      ambientLight.color.setHex(0xE5F0FF);
      ledMaterial.color.setHex(0xFFFFFF);
    } else if (lighting === 'golden') {
      keyLight.color.setHex(0xFFB56B);
      keyLight.intensity = 2.4;
      ambientLight.color.setHex(0xFFDAB0);
      ledMaterial.color.setHex(0xFFD479);
    } else {
      keyLight.color.setHex(0xFCE4B8);
      keyLight.intensity = 1.9;
      ambientLight.color.setHex(0x2B231E);
      ledMaterial.color.setHex(0xFFD269);
    }
  }, [countertop, cabinetFinish, hardware, lighting]);

  if (hasWebGlError) {
    return (
      <div className="relative w-full h-[520px] bg-[#171717] flex flex-col items-center justify-center p-8 text-center border border-[#C6A875]/20">
        <div className="font-serif text-2xl text-[#C6A875] mb-2">3D Architectural Island Preview</div>
        <p className="text-xs text-[#D8CCBA]/70 max-w-md">
          Hardware acceleration mode fallback. Switch to Room Perspective or Floor Plan to inspect your custom {countertop} + {cabinetFinish} specification.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] bg-[#131110] overflow-hidden">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Interaction Badge */}
      <div className="absolute top-4 left-4 bg-[#171717]/85 backdrop-blur-md border border-[#C6A875]/30 px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-[#D8CCBA] flex items-center gap-2 select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A875]" />
        <span>Interactive 3D WebGL · Click & Drag to Orbit</span>
      </div>

      <div className="absolute bottom-4 right-4 bg-[#171717]/85 backdrop-blur-md border border-[#C6A875]/30 px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#D8CCBA]/80 select-none pointer-events-none">
        Active Spec: <span className="text-[#C6A875] font-semibold">{countertop} · {cabinetFinish}</span>
      </div>
    </div>
  );
};
