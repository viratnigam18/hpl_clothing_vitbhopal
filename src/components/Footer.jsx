import { Link } from 'react-router-dom';

/**
 * Footer — minimal dark footer with HPL branding and social links.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="container-hpl py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-heading text-xl text-gold tracking-wider">
            HPL CLOTHING
          </span>
          <p className="text-text-muted text-xs">
            Official merch store · VIT Bhopal
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link to="/shop" className="hover:text-gold transition-colors no-underline">
            Shop
          </Link>
          <Link to="/about" className="hover:text-gold transition-colors no-underline">
            About
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors no-underline"
            aria-label="Follow HPL on Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-text-muted text-xs text-center md:text-right">
          © {new Date().getFullYear()} HPL · Made for VIT Bhopal
        </p>
      </div>
    </footer>
  );
}
