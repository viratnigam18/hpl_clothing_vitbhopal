import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * TeamWardrobe — 3D team-picker carousel modal.
 *
 * Inspired by the "Wardrobe" jersey-picker UI:
 * circular glowing ring behind the title, 3D perspective carousel
 * with center item large + lit, sides fading into shadow.
 *
 * @param {object} props
 * @param {boolean} props.isOpen — whether the modal is visible
 * @param {function} props.onClose — callback to close
 * @param {function} props.onSelectTeam — callback(team) when a team is selected
 */

const TEAMS_DATA = [
  {
    id: '1',
    name: 'Kabini Lynx',
    slug: 'kabini-lynx',
    color: '#8E44AD',
    label: 'HPL SEASON 3',
    logo: '/images/logos/lynx.svg',
  },
  {
    id: '2',
    name: 'Ken Cheetahs',
    slug: 'ken-cheetahs',
    color: '#E67E22',
    label: 'HPL SEASON 3',
    logo: '/images/logos/cheetahs.svg',
  },
  {
    id: '3',
    name: 'Shimsha Panthers',
    slug: 'shimsha-panthers',
    color: '#2C3E50',
    label: 'HPL SEASON 3',
    logo: '/images/logos/panthers.svg',
  },
  {
    id: '4',
    name: 'Tons Tigers',
    slug: 'tons-tigers',
    color: '#F39C12',
    label: 'HPL SEASON 3',
    logo: '/images/logos/tiger.svg',
  },
  {
    id: '5',
    name: 'Orsang Leopards',
    slug: 'orsang-leopards',
    color: '#C0392B',
    label: 'HPL SEASON 3',
    logo: '/images/logos/leopards.svg',
  },
  {
    id: '6',
    name: 'Arkavati Lions',
    slug: 'arkavati-lions',
    color: '#2980B9',
    label: 'HPL SEASON 3',
    logo: '/images/logos/lions.svg',
  },
  {
    id: '7',
    name: 'Harangi Jaguars',
    slug: 'harangi-jaguars',
    color: '#27AE60',
    label: 'HPL SEASON 3',
    logo: '/images/logos/jaguars.svg',
  },
];

export default function TeamWardrobe({
  isOpen = false,
  onClose,
  onSelectTeam,
  teams = TEAMS_DATA,
}) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const n = teams.length;

  const activeTeam = teams[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + n) % n);
  }, [n]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrev, onClose, currentIndex]);

  // Touch/swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
  };

  const handleSelect = () => {
    if (onSelectTeam) {
      onSelectTeam(activeTeam);
    } else {
      navigate(`/teams/${activeTeam.slug}`);
    }
    onClose?.();
  };

  // Calculate position for each item in the 3D wheel
  const getItemStyle = (index) => {
    let offset = index - currentIndex;
    // Wrap around
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    const absOffset = Math.abs(offset);
    const angle = offset * 45; // degrees of rotation
    const translateZ = -absOffset * 120; // push back
    const translateX = offset * 140; // horizontal spread
    const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.72 : absOffset === 2 ? 0.52 : 0.35;
    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.6 : absOffset === 2 ? 0.3 : 0.12;
    const zIndex = 10 - absOffset;
    const blur = absOffset === 0 ? 0 : absOffset === 1 ? 1 : 3;
    const rotateY = angle * 0.6;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
    };
  };

  // Responsive radius
  const getMobileItemStyle = (index) => {
    let offset = index - currentIndex;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    const absOffset = Math.abs(offset);
    const translateX = offset * 100;
    const translateZ = -absOffset * 80;
    const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.65 : 0.4;
    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.5 : 0.15;
    const zIndex = 10 - absOffset;
    const blur = absOffset === 0 ? 0 : absOffset === 1 ? 1.5 : 3;
    const rotateY = offset * 30;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            ref={containerRef}
            className="relative w-full max-w-[900px] mx-4 sm:mx-8 flex flex-col items-center select-none"
            style={{ perspective: '1200px' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              className="absolute top-0 right-0 sm:right-4 w-10 h-10 flex items-center justify-center
                         text-white/40 hover:text-white transition-colors z-50 rounded-full
                         hover:bg-white/5"
              onClick={onClose}
              aria-label="Close team picker"
              id="wardrobe-close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ====== HEADER: Glowing ring + title ====== */}
            <div className="relative flex flex-col items-center mb-8 sm:mb-12">
              {/* Glowing elliptical ring — the signature element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] h-[80px] sm:h-[100px]">
                {/* Outer ring glow */}
                <motion.div
                  className="absolute inset-0 rounded-[50%]"
                  style={{
                    border: '1.5px solid',
                    borderColor: `${activeTeam?.color || '#d4af37'}44`,
                    boxShadow: `
                      0 0 30px ${activeTeam?.color || '#d4af37'}15,
                      0 0 60px ${activeTeam?.color || '#d4af37'}08,
                      inset 0 0 30px ${activeTeam?.color || '#d4af37'}08
                    `,
                  }}
                  animate={{
                    borderColor: `${activeTeam?.color || '#d4af37'}44`,
                    boxShadow: `
                      0 0 30px ${activeTeam?.color || '#d4af37'}15,
                      0 0 60px ${activeTeam?.color || '#d4af37'}08,
                      inset 0 0 30px ${activeTeam?.color || '#d4af37'}08
                    `,
                  }}
                  transition={{ duration: 0.5 }}
                />
                {/* Inner brighter ring */}
                <motion.div
                  className="absolute inset-[6px] rounded-[50%]"
                  style={{
                    border: '1px solid',
                    borderColor: `${activeTeam?.color || '#d4af37'}22`,
                  }}
                  animate={{
                    borderColor: `${activeTeam?.color || '#d4af37'}22`,
                  }}
                  transition={{ duration: 0.5 }}
                />
                {/* Top highlight */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${activeTeam?.color || '#d4af37'}60, transparent)`,
                  }}
                  animate={{
                    background: `linear-gradient(90deg, transparent, ${activeTeam?.color || '#d4af37'}60, transparent)`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Title text */}
              <h2
                className="relative z-10 font-heading text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white/90 mb-1"
                style={{ fontFamily: '"Anton", sans-serif' }}
              >
                WARDROBE
              </h2>
              <p className="relative z-10 text-[11px] sm:text-xs tracking-[0.3em] text-white/40 uppercase">
                {n} Items
              </p>
            </div>

            {/* ====== 3D CAROUSEL ====== */}
            <div
              className="relative w-full flex items-center justify-center"
              style={{
                height: 'clamp(280px, 45vw, 420px)',
                perspective: '1200px',
              }}
            >
              {/* Background ambient glow from active team */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: 'clamp(200px, 35vw, 350px)',
                  height: 'clamp(200px, 35vw, 350px)',
                }}
                animate={{
                  background: `radial-gradient(circle, ${activeTeam?.color || '#d4af37'}12 0%, transparent 70%)`,
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Wardrobe rail / hanger bar */}
              <div className="absolute top-[12%] left-1/2 -translate-x-1/2 pointer-events-none" style={{ perspective: '600px' }}>
                <div
                  className="w-[200px] sm:w-[300px] h-[3px] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.3) 70%, transparent 100%)',
                    transform: 'rotateX(60deg)',
                    boxShadow: '0 0 12px rgba(212,175,55,0.15)',
                  }}
                />
              </div>

              {/* Items ring */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  width: '100%',
                  height: '100%',
                }}
              >
                {teams.map((team, i) => {
                  const isActive = i === currentIndex;
                  return (
                    <motion.div
                      key={team.id}
                      className="absolute flex flex-col items-center cursor-pointer"
                      style={{
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, opacity, filter',
                      }}
                      animate={
                        typeof window !== 'undefined' && window.innerWidth < 640
                          ? getMobileItemStyle(i)
                          : getItemStyle(i)
                      }
                      transition={
                        prefersReduced
                          ? { duration: 0.15 }
                          : { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 }
                      }
                      onClick={() => {
                        if (isActive) {
                          handleSelect();
                        } else {
                          setCurrentIndex(i);
                        }
                      }}
                      aria-label={`${team.name}${isActive ? ', currently selected' : ''}`}
                    >
                      {/* Hanger hook */}
                      <div className="relative mb-[-4px] z-10">
                        <svg
                          width="24"
                          height="20"
                          viewBox="0 0 24 20"
                          fill="none"
                          className="opacity-50"
                        >
                          <path
                            d="M12 0 L12 8 Q12 14 6 14 L18 14 Q12 14 12 8"
                            stroke={isActive ? '#d4af37' : '#666'}
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>
                      </div>

                      {/* Logo container */}
                      <motion.div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                          width: 'clamp(120px, 20vw, 200px)',
                          height: 'clamp(150px, 25vw, 260px)',
                          background: `
                            linear-gradient(180deg, 
                              ${team.color}15 0%, 
                              #0d0d0d 40%,
                              #0a0a0a 100%)
                          `,
                          border: isActive
                            ? `1px solid ${team.color}40`
                            : '1px solid rgba(255,255,255,0.06)',
                        }}
                        animate={{
                          boxShadow: isActive
                            ? `0 8px 40px ${team.color}20, 0 0 80px ${team.color}08, inset 0 1px 0 ${team.color}15`
                            : '0 4px 20px rgba(0,0,0,0.4)',
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Active glow ring behind logo */}
                        {isActive && (
                          <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                            style={{
                              width: '70%',
                              height: '70%',
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: 1,
                              scale: [1, 1.1, 1],
                              background: `radial-gradient(circle, ${team.color}18 0%, transparent 70%)`,
                            }}
                            transition={{
                              opacity: { duration: 0.3 },
                              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                            }}
                          />
                        )}

                        {/* Team logo image */}
                        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6">
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-full h-full object-contain drop-shadow-lg"
                            draggable={false}
                            loading="lazy"
                            style={{
                              filter: isActive
                                ? `drop-shadow(0 0 12px ${team.color}30)`
                                : 'none',
                            }}
                          />
                        </div>

                        {/* Bottom gradient fade */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                          style={{
                            background: `linear-gradient(transparent, ${isActive ? team.color + '08' : '#0a0a0a'})`,
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ====== NAV ARROWS ====== */}
              {/* Left arrow */}
              <motion.button
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20
                           w-11 h-11 sm:w-12 sm:h-12 rounded-full
                           flex items-center justify-center
                           bg-white/[0.04] border border-white/[0.08]
                           text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15]
                           transition-all duration-200
                           active:scale-90"
                onClick={goPrev}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Previous team"
                id="wardrobe-prev"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>

              {/* Right arrow */}
              <motion.button
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20
                           w-11 h-11 sm:w-12 sm:h-12 rounded-full
                           flex items-center justify-center
                           bg-white/[0.04] border border-white/[0.08]
                           text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15]
                           transition-all duration-200
                           active:scale-90"
                onClick={goNext}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Next team"
                id="wardrobe-next"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>

            {/* ====== BOTTOM LABEL ====== */}
            <div className="mt-4 sm:mt-6 flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.h3
                    className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.15em] text-white uppercase"
                    style={{ fontFamily: '"Anton", "Inter", sans-serif' }}
                  >
                    {activeTeam?.name}
                  </motion.h3>
                  <p className="text-[11px] sm:text-xs tracking-[0.25em] text-white/35 uppercase mt-1">
                    {activeTeam?.label || 'HPL SEASON 3'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Select button */}
              <motion.button
                className="mt-5 sm:mt-6 px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.15em]
                           transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${activeTeam?.color || '#d4af37'}30, ${activeTeam?.color || '#d4af37'}10)`,
                  border: `1px solid ${activeTeam?.color || '#d4af37'}35`,
                  color: activeTeam?.color || '#d4af37',
                }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: `0 0 25px ${activeTeam?.color || '#d4af37'}20`,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSelect}
                id="wardrobe-select"
              >
                View Merch
              </motion.button>

              {/* Dot indicators */}
              <div className="flex items-center gap-1.5 mt-5">
                {teams.map((team, i) => (
                  <button
                    key={team.id}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === currentIndex ? 20 : 6,
                      height: 6,
                      background:
                        i === currentIndex
                          ? team.color
                          : 'rgba(255,255,255,0.12)',
                    }}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to ${team.name}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
