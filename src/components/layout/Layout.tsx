import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: 'var(--page-bg)', color: 'var(--text-primary)' }}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
