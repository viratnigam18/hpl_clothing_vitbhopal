import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TeamWardrobe from './TeamWardrobe';

/**
 * Navbar — fixed glass-dark nav with HPL logo, nav links, and Teams wardrobe trigger.
 * Mobile hamburger → slide-out drawer.
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 glass-dark z-[100] h-16"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-hpl h-full flex items-center justify-between">
          {/* Logo + Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline"
            id="nav-logo"
          >
            <img
              src="/images/hpl_logo.png"
              alt="HPL Logo"
              className="h-9 w-auto object-contain"
              style={{ maxWidth: 40 }}
            />
            <span className="hidden sm:block font-heading text-sm tracking-widest uppercase text-text-primary">
              HPL <span className="text-gold">Clothing</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                id={`nav-${link.label.toLowerCase()}`}
                className={`
                  relative text-sm uppercase tracking-wider font-medium
                  transition-colors duration-200 no-underline
                  ${isActive(link.to)
                    ? 'text-gold'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Teams Wardrobe trigger */}
            <button
              className="relative text-sm uppercase tracking-wider font-medium
                         text-text-secondary hover:text-gold transition-colors duration-200
                         flex items-center gap-1.5"
              onClick={() => setWardrobeOpen(true)}
              id="nav-teams"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Teams
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            id="nav-hamburger"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-[199] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-64 bg-bg-card border-l border-gold/10 z-[200] md:hidden flex flex-col pt-20 px-6 gap-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    text-lg uppercase tracking-wider font-heading no-underline
                    ${isActive(link.to) ? 'text-gold' : 'text-text-secondary'}
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Teams button in mobile drawer */}
              <button
                className="text-lg uppercase tracking-wider font-heading text-text-secondary hover:text-gold transition-colors text-left"
                onClick={() => {
                  setMobileOpen(false);
                  setWardrobeOpen(true);
                }}
              >
                Teams
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="h-16" />

      {/* Team Wardrobe Modal */}
      <TeamWardrobe
        isOpen={wardrobeOpen}
        onClose={() => setWardrobeOpen(false)}
      />
    </>
  );
}
