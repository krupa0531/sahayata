import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Cpu, Radio, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiEarthGlobe() {
  const mountRef = useRef(null);
  const [telemetry, setTelemetry] = useState({
    onlineWorkers: 4852109,
    liveRequests: 1420,
    aiStatus: 'OPTIMAL (99.8% CONFIDENCE)',
    quantumNodes: '28 Active Nodes'
  });

  // Real-time telemetry tick animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        onlineWorkers: prev.onlineWorkers + Math.floor(Math.random() * 15 - 5),
        liveRequests: Math.floor(1350 + Math.random() * 180)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Three.js 3D Globe Implementation
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 260;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Sphere Geometry
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);

    // Cyan Specular Earth Shader Material
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 512;
    canvasTexture.height = 256;
    const ctx = canvasTexture.getContext('2d');
    
    // Draw deep space cyan/teal map grid pattern
    ctx.fillStyle = '#081223';
    ctx.fillRect(0, 0, 512, 256);
    
    ctx.fillStyle = '#00E5FF';
    // Draw dots simulating continental map nodes
    for (let i = 0; i < 1800; i++) {
      const u = Math.random();
      const v = Math.random();
      // Density bias for landmass regions
      if ((v > 0.2 && v < 0.8 && (u < 0.4 || (u > 0.6 && u < 0.9))) || Math.random() > 0.7) {
        ctx.beginPath();
        ctx.arc(u * 512, v * 256, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvasTexture);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x00E5FF,
      emissive: 0x081223,
      specular: 0x00E5FF,
      shininess: 40,
      wireframe: false,
      transparent: true,
      opacity: 0.92
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Wireframe Atmospheric Grid Ring
    const atmosphereGeometry = new THREE.SphereGeometry(1.08, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Outer Cyan Glow Ring / Orbit Arcs
    const ringGeometry = new THREE.RingGeometry(1.25, 1.27, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x2DD4BF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3.2;
    scene.add(ring);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x081223, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00E5FF, 2.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x2DD4BF, 2, 10);
    pointLight.position.set(-3, -2, 2);
    scene.add(pointLight);

    // Animation Loop
    let reqId;
    const animate = () => {
      globe.rotation.y += 0.006;
      atmosphere.rotation.y += 0.003;
      ring.rotation.z += 0.002;
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      globeGeometry.dispose();
      globeMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="command-glass-card earth-widget-card">
      {/* Widget Header */}
      <div className="earth-widget-header">
        <div className="earth-widget-title">
          <Globe size={20} className="nav-icon-glow" />
          <span>GLOBAL AI TELEMETRY</span>
        </div>
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          color: '#00E5FF',
          background: 'rgba(0, 229, 255, 0.12)',
          padding: '3px 8px',
          borderRadius: '10px',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Zap size={10} /> HERO 3D ENGINE
        </span>
      </div>

      {/* 3D Earth Globe Viewport */}
      <div className="earth-canvas-container" ref={mountRef}>
        {/* Floating Pulsing Nodes overlay */}
        <motion.div
          style={{
            position: 'absolute',
            top: '30%',
            left: '48%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00E5FF',
            boxShadow: '0 0 12px #00E5FF'
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Telemetry Metrics Panel */}
      <div className="earth-telemetry-panel">
        <div className="telemetry-row">
          <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} color="#00E5FF" /> Online Workers
          </span>
          <span className="telemetry-value">
            {telemetry.onlineWorkers.toLocaleString()}
          </span>
        </div>

        <div className="telemetry-row">
          <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#2DD4BF" /> Live Requests/sec
          </span>
          <span className="telemetry-value" style={{ color: '#2DD4BF' }}>
            {telemetry.liveRequests} req/s
          </span>
        </div>

        <div className="telemetry-row">
          <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color="#38BDF8" /> AI Underwriting Status
          </span>
          <span className="telemetry-value" style={{ color: '#38BDF8', fontSize: '0.75rem' }}>
            {telemetry.aiStatus}
          </span>
        </div>

        <div className="telemetry-row" style={{ paddingTop: '4px', borderTop: '1px stroke rgba(0, 229, 255, 0.1)' }}>
          <span className="telemetry-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#22C55E" /> Quantum Nodes
          </span>
          <span className="telemetry-value" style={{ color: '#22C55E' }}>
            {telemetry.quantumNodes}
          </span>
        </div>
      </div>
    </div>
  );
}
