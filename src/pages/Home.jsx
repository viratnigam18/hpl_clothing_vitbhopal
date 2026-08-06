import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '@/hooks/useTeams';
import { useProducts } from '@/hooks/useProducts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import GoldShine from '@/components/GoldShine';
import TeamBadge from '@/components/TeamBadge';
import ProductCard from '@/components/ProductCard';
import SectionReveal from '@/components/SectionReveal';
import CountdownBanner from '@/components/CountdownBanner';
import MagneticButton from '@/components/MagneticButton';
import TeamWardrobe from '@/components/TeamWardrobe';
import Jersey3DViewer from '@/components/Jersey3DViewerLazy';

const TEAM_COLORS = {
  'kabini-lynx': '#8E44AD',
  'ken-cheetahs': '#E67E22',
  'shimsha-panthers': '#2C3E50',
  'tons-tigers': '#F39C12',
  'orsang-leopards': '#C0392B',
  'arkavati-lions': '#2980B9',
  'harangi-jaguars': '#27AE60',
};

export default function Home() {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { products: bestsellers } = useProducts();
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

  const bestsellerProducts = bestsellers.filter((p) => p.is_bestseller);

  const selectedTeam = teams[selectedTeamIndex] || teams[0];
  const selectedColor = selectedTeam
    ? TEAM_COLORS[selectedTeam.slug] || selectedTeam.color_hex || '#d4af37'
    : '#d4af37';

  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-card/50 to-bg" />
        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* HPL Crest with gold shine */}
          <GoldShine className="mb-8">
            <motion.div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gold/30 flex items-center justify-center bg-bg-card/80"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-heading text-4xl sm:text-5xl text-gradient-gold">
                HPL
              </span>
            </motion.div>
          </GoldShine>

          {/* Tagline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Wear Your Team.
            <br />
            <span className="text-gradient-gold">Own the Field.</span>
          </motion.h1>

          <motion.p
            className="text-text-secondary text-base sm:text-lg max-w-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Official merchandise for all 7 HPL teams. Premium jerseys, hoodies, tees & caps.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <MagneticButton
              variant="primary"
              onClick={() => navigate('/shop')}
              id="hero-shop-cta"
            >
              Shop Now
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              onClick={() => setWardrobeOpen(true)}
              id="hero-wardrobe-cta"
            >
              Pick Your Team
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ====== CHOOSE YOUR TEAM + 3D JERSEY ====== */}
      <SectionReveal>
        <section className="py-16 sm:py-20">
          <div className="container-hpl">
            {/* Section header */}
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl text-text-primary">
                Choose Your <span className="text-gradient-gold">Team</span>
              </h2>
              <button
                className="text-xs sm:text-sm text-text-muted hover:text-gold transition-colors
                           uppercase tracking-wider flex items-center gap-2"
                onClick={() => setWardrobeOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                3D View
              </button>
            </div>

            {/* Team badge selector row */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-12">
              {teams.map((team, i) => (
                <motion.button
                  key={team.id}
                  className={`
                    relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl
                    transition-all duration-300 border
                    ${i === selectedTeamIndex
                      ? 'border-gold/30 bg-white/[0.03]'
                      : 'border-transparent hover:bg-white/[0.02]'
                    }
                  `}
                  onClick={() => setSelectedTeamIndex(i)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Team color circle */}
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      border: `2px solid ${i === selectedTeamIndex ? team.color_hex : team.color_hex + '40'}`,
                      boxShadow: i === selectedTeamIndex
                        ? `0 0 20px ${team.color_hex}25, inset 0 0 12px ${team.color_hex}10`
                        : 'none',
                      background: i === selectedTeamIndex
                        ? `${team.color_hex}12`
                        : 'transparent',
                    }}
                  >
                    <span
                      className="font-heading text-xs sm:text-sm tracking-wider"
                      style={{
                        color: i === selectedTeamIndex ? team.color_hex : team.color_hex + '80',
                      }}
                    >
                      {team.name?.split(' ').map((w) => w[0]).join('')}
                    </span>
                  </div>

                  {/* Team name (visible on selected) */}
                  <span
                    className={`text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 max-w-[80px] truncate
                      ${i === selectedTeamIndex ? 'text-white/70' : 'text-white/20'}
                    `}
                  >
                    {team.name?.split(' ').pop()}
                  </span>

                  {/* Active indicator dot */}
                  {i === selectedTeamIndex && (
                    <motion.div
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                      style={{ background: team.color_hex }}
                      layoutId="team-indicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* 3D Jersey Viewer */}
            <div className="relative">
              <Jersey3DViewer
                modelPath="/models/jersey/scene.gltf"
                teamColor={selectedColor}
                teamName={selectedTeam?.name || ''}
                teamLabel="Official HPL Jersey"
                height={typeof window !== 'undefined' && window.innerWidth < 640 ? 380 : 520}
                className="mx-auto max-w-[700px]"
              />
            </div>

            {/* View team merch CTA */}
            <motion.div
              className="flex justify-center mt-14"
              key={selectedTeamIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MagneticButton
                variant="secondary"
                onClick={() => navigate(`/teams/${selectedTeam?.slug}`)}
                id="view-team-merch"
              >
                <span className="flex items-center gap-2">
                  View {selectedTeam?.name} Merch
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* ====== COUNTDOWN BANNER ====== */}
      <CountdownBanner />

      {/* ====== BEST SELLERS ====== */}
      {bestsellerProducts.length > 0 && (
        <SectionReveal>
          <section className="py-16 sm:py-20">
            <div className="container-hpl">
              <h2 className="text-2xl sm:text-3xl text-text-primary mb-10">
                Best <span className="text-gradient-gold">Sellers</span>
              </h2>

              <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
                {bestsellerProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
                  >
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      )}

      {/* ====== TEAM WARDROBE MODAL ====== */}
      <TeamWardrobe
        isOpen={wardrobeOpen}
        onClose={() => setWardrobeOpen(false)}
      />
    </div>
  );
}
