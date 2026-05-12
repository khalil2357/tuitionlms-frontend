import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white transition-colors duration-500 dark:bg-[#1E1E1E]">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
