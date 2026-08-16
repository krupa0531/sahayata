import React, { useEffect, useRef } from 'react';

export default function CommandCenterBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Generate stars and floating particles
    const starCount = 160;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
      pulsing: Math.random() > 0.5,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.3 ? '#00E5FF' : (Math.random() > 0.5 ? '#2DD4BF' : '#F8FAFC')
    }));

    // Floating glowing energy lines / sweeps
    let lightSweepX = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space radial background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 100,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      bgGradient.addColorStop(0, '#0D1B2A');
      bgGradient.addColorStop(0.5, '#081223');
      bgGradient.addColorStop(1, '#050816');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render stars & glowing dust
      stars.forEach((star) => {
        if (star.pulsing) {
          star.alpha += star.pulseSpeed;
          if (star.alpha > 0.95 || star.alpha < 0.15) {
            star.pulseSpeed = -star.pulseSpeed;
          }
        }

        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.shadowBlur = star.radius > 1.2 ? 10 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.restore();
      });

      // Animated slow laser sweep across background
      lightSweepX = (lightSweepX + 0.8) % (canvas.width + 400);
      ctx.save();
      const sweepGrad = ctx.createLinearGradient(lightSweepX - 200, 0, lightSweepX, canvas.height);
      sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      sweepGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.04)');
      sweepGrad.addColorStop(1, 'rgba(45, 212, 191, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="space-background-canvas" />
      <div className="grid-overlay" />
      <div className="ambient-nebula-glow" />
    </>
  );
}
