import { useEffect, useRef } from 'react';

export function SakuraPetals() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const petalColors = ['#ffb6c1', '#ff9aaf', '#ffc2d1', '#ffd1dc', '#ff8fa3'];
    const petalCount = 25;

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      const size = Math.random() * 10 + 6;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 10;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];

      petal.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${left}vw;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50% 0 50% 0;
        opacity: ${Math.random() * 0.4 + 0.3};
        pointer-events: none;
        z-index: 9999;
        animation: sakura-fall ${duration}s linear ${delay}s infinite;
      `;
      container.appendChild(petal);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
