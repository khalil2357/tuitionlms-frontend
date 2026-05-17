import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    const root = document.documentElement;

    const updatePointer = (x: number, y: number) => {
      root.style.setProperty('--pointer-x', `${x}px`);
      root.style.setProperty('--pointer-y', `${y}px`);
    };

    const onMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div className="site-shell min-h-screen transition-colors duration-500" style={{ background: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div aria-hidden="true" className="site-liquid-layer pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="site-liquid-glow site-liquid-glow-a" />
        <div className="site-liquid-glow site-liquid-glow-b" />
        <div className="site-liquid-glow site-liquid-glow-c" />
        <div className="site-liquid-grid" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="relative z-10 flex-1">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
