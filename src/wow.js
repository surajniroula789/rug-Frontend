import React, { useEffect, useRef } from 'react';

const Canvas = React.forwardRef((props, ref) => {
    return <canvas ref={ref} {...props} />;
  });

const ParticleAnimation = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      init();
    };

    const Particle = class {
      constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.ttl = 1000;
      }

      draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
      }

      update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.ttl--;
      }
    };

    let particles;

    const init = () => {
      particles = [];
    };

    let hue = 0;
    let hueRadians = 0;

    const generateRing = () => {
      setTimeout(generateRing, 200);
      hue = Math.sin(hueRadians);

      const particleCount = 100;

      for (let i = 0; i < particleCount; i++) {
        const radian = (Math.PI * 2) / particleCount;
        const x = mouse.x;
        const y = mouse.y;

        particles.push(
          new Particle(x, y, 5, `hsl(${Math.abs(hue * 360)}, 50%, 50%)`, {
            x: Math.cos(radian * i) * 3,
            y: Math.sin(radian * i) * 3
          })
        );
      }

      hueRadians += 0.01;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      c.fillStyle = 'rgba(0, 0, 0, 0.1)';
      c.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        if (particle.ttl < 0) {
          particles.splice(i, 1);
        } else {
          particle.update();
        }
      });
    };

    init();
    animate();
    generateRing();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default ParticleAnimation;
