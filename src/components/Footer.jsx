import { Link } from 'react-router-dom';

/**
 * Footer — HPL branding with Instagram and VIT Bhopal links.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="container-hpl py-10 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Branding */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src="/images/hpl_logo.png"
            alt="HPL Logo"
            className="h-10 w-auto object-contain"
          />
          <p className="text-text-muted text-xs">
            Official merch store · VIT Bhopal
          </p>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link to="/shop" className="hover:text-gold transition-colors no-underline">
            Shop
          </Link>
          <Link to="/about" className="hover:text-gold transition-colors no-underline">
            About
          </Link>
        </div>

        {/* Social + College Links */}
        <div className="flex items-center gap-4">

          {/* Instagram */}
          <a
            href="https://www.instagram.com/hpl.vitbhopal?igsh=ZDVoNmoybnc2ajQy"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-text-secondary hover:text-white transition-all no-underline"
            aria-label="Follow HPL on Instagram"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 group-hover:bg-gradient-to-br group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] transition-all duration-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </span>
            <span className="text-xs font-medium hidden sm:block group-hover:text-white transition-colors">
              @hpl.vitbhopal
            </span>
          </a>

          {/* Official HPL Site */}
          <a
            href="https://www.hplvitbhopal.site"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-text-secondary hover:text-gold transition-all no-underline"
            aria-label="Official HPL League Website"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 group-hover:bg-gold/10 transition-all duration-300">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </span>
            <span className="text-xs font-medium hidden sm:block group-hover:text-gold transition-colors">
              Official HPL Site
            </span>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-hpl py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} HPL Clothing · Official Merchandise Partner
          </p>
          <a
            href="https://www.hplvitbhopal.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted text-xs hover:text-gold transition-colors no-underline flex items-center gap-1.5"
          >
            <span>hplvitbhopal.site</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
