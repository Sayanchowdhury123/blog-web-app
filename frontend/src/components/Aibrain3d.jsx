import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function AIBrain3D() {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f); // Dark background

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create pulsing core (brain)
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.3
    });
    const brain = new THREE.Mesh(geometry, material);
    scene.add(brain);

    // Add neural connections (lines)
    const connections = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle) * 2;
      const z = 0;

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.7 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      connections.push(line);
      scene.add(line);
    }

    // Add floating data particles
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x10B981,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Pulsing effect
      brain.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      // Rotate connections
      connections.forEach((line, i) => {
        line.rotation.y = time * 0.5 + i * 0.1;
      });

      // Move particles
      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.01;
        positions[i + 1] += Math.cos(time + i) * 0.01;
        positions[i + 2] += Math.sin(time + i + 1) * 0.01;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10 backdrop-blur-sm"
      style={{ position: 'relative' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-400 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}