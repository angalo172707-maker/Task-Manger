import { useEffect } from 'react';

export default function GlitterTrail() {
  useEffect(() => {
    let throttleTimer;
    
    const handleMouseMove = (e) => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 15); // Spawn sparks faster

      const particle = document.createElement('div');
      particle.className = 'glitter-particle';
      
      // Wider scatter
      const offsetX = (Math.random() - 0.5) * 35;
      const offsetY = (Math.random() - 0.5) * 35;
      
      particle.style.left = `${e.clientX + offsetX}px`;
      particle.style.top = `${e.clientY + offsetY}px`;
      
      // Bolder size
      const size = Math.random() * 10 + 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random Rainbow Colors
      const hue = Math.floor(Math.random() * 360);
      const color = `hsl(${hue}, 100%, 65%)`;
      
      particle.style.background = color;
      particle.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`;
      
      document.body.appendChild(particle);
      
      // Last longer
      setTimeout(() => {
        particle.remove();
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}
