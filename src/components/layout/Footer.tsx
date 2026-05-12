import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Courses', href: '#courses' },
  { label: 'Contact', href: '#contact' },
  { label: 'Support', href: '#support' },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) {
      return;
    }

    gsap.fromTo(
      footerRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-[var(--surface-border)] bg-[var(--surface)] px-4 py-10 text-[var(--text-primary)] sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_25%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text-secondary)] backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_18px_rgba(139,92,246,0.8)]" />
            Built for course delivery, learner progress, and admin oversight
          </div>

          <h2 className="font-['Bricolage_Grotesque',sans-serif] text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl">
            Build momentum with a modern learning experience.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            One product for students, instructors, and administrators with polished navigation,
            responsive layout, and motion-first interactions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {footerLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text-secondary)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#8B5CF6] hover:text-white"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Platform</p>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <a className="block transition hover:text-white" href="#dashboard">
              Dashboard
            </a>
            <a className="block transition hover:text-white" href="#instructors">
              Instructors
            </a>
            <a className="block transition hover:text-white" href="#community">
              Community
            </a>
            <a className="block transition hover:text-white" href="#blog">
              Blog
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Connect</p>
          <div className="flex flex-wrap gap-3">
            {['GitHub', 'Email', 'YouTube'].map((label) => (
              <button
                key={label}
                type="button"
                className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] text-[var(--text-secondary)] transition duration-300 hover:-translate-y-1 hover:bg-[#8B5CF6] hover:text-white"
                aria-label={label}
              >
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4 backdrop-blur">
            <p className="text-sm text-[var(--text-secondary)]">Need help or a platform walkthrough?</p>
            <a
              href="#top"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white shadow-[0_16px_35px_rgba(139,92,246,0.35)] transition duration-300 hover:scale-[1.02] hover:bg-[#9f75ff]"
            >
              Back to top
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-[var(--surface-border)] pt-6 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Tuition LMS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
