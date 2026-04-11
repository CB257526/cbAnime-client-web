import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    L2Dwidget: any;
  }
}

interface Live2DWidgetProps {
  jsonPath?: string;
  displayWidth?: number;
  displayHeight?: number;
  hOffset?: number;
  vOffset?: number;
  opacity?: number;
}

export function Live2DWidget({
  jsonPath = 'https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json',
  displayWidth = 280,
  displayHeight = 250,
  hOffset = -20,
  vOffset = -20,
  opacity = 0.8,
}: Live2DWidgetProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initWidget = () => {
      if (window.L2Dwidget) {
        window.L2Dwidget.init({
          model: {
            jsonPath: jsonPath,
          },
          display: {
            position: 'right',
            width: displayWidth,
            height: displayHeight,
            hOffset: hOffset,
            vOffset: vOffset,
          },
          mobile: {
            show: true,
          },
          react: {
            opacity: opacity,
            retina: true,
          },
        });
      }
    };

    const init = async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js');
        if (document.readyState === 'complete') {
          initWidget();
        } else {
          window.addEventListener('load', initWidget);
        }
      } catch (error) {
        console.error('Failed to initialize Live2D widget:', error);
      }
    };

    init();

    return () => {
      window.removeEventListener('load', initWidget);
    };
  }, [jsonPath, displayWidth, displayHeight, hOffset, vOffset, opacity]);

  return null;
}