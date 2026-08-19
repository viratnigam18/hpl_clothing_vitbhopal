/**
 * ============================================================
 * ADD LATER — "Choose Your Team" Inline Carousel + 3D Jersey
 * ============================================================
 * Drop this block inside Home.jsx where you want the section.
 *
 * Requirements:
 *  - import Jersey3DViewer from '@/components/Jersey3DViewerLazy';
 *  - import TeamWardrobe from '@/components/TeamWardrobe';
 *  - import MagneticButton from '@/components/MagneticButton';
 *  - import SectionReveal from '@/components/SectionReveal';
 *  - import { useTeams } from '@/hooks/useTeams';
 *  - State: const [selectedIdx, setSelectedIdx] = useState(0);
 *  - State: const [wardrobeOpen, setWardrobeOpen] = useState(false);
 *  - Helper: getLogoFilename(slug) — see bottom of Home.jsx
 *  - Helper: getCardStyle(index) — see bottom of this file
 * ============================================================
 */

// ---- getCardStyle helper (add inside component or as standalone fn) ----
// const getCardStyle = (index) => {
//   let off = index - selectedIdx;
//   if (off > n / 2) off -= n;
//   if (off < -n / 2) off += n;
//   const abs = Math.abs(off);
//   return {
//     x: off * 130,
//     z: -abs * 100,
//     rotateY: off * 35,
//     scale: abs === 0 ? 1 : abs === 1 ? 0.75 : abs === 2 ? 0.55 : 0.38,
//     opacity: abs === 0 ? 1 : abs === 1 ? 0.6 : abs === 2 ? 0.25 : 0.08,
//     filter: abs === 0 ? 'blur(0px)' : abs === 1 ? 'blur(1px)' : 'blur(2.5px)',
//     zIndex: 10 - abs,
//   };
// };

// ---- JSX Section ----
/*
<SectionReveal>
  <section className="py-16 sm:py-24 overflow-hidden">
    <div className="container-hpl">
      <h2 className="text-center text-2xl sm:text-3xl text-text-primary mb-12">
        Choose Your <span className="text-gradient-gold">Team</span>
      </h2>

      {/* Layout: carousel left, 3D jersey right (stacked on mobile) *\/}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

        {/* ===== LEFT: 3D Team Carousel ===== *\/}
        <div className="relative w-full lg:w-3/5 select-none" style={{ perspective: '1000px' }}>

          {/* Carousel viewport *\/}
          <div
            className="relative mx-auto flex items-center justify-center"
            style={{ height: 320 }}
          >
            {/* Gold rail *\/}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
              <div
                className="w-[180px] sm:w-[260px] h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.25) 70%, transparent)',
                  transform: 'rotateX(60deg)',
                  boxShadow: '0 0 10px rgba(212,175,55,0.1)',
                }}
              />
            </div>

            {/* Team cards *\/}
            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {teams.map((team, i) => {
                const s = getCardStyle(i);
                const isActive = i === selectedIdx;
                return (
                  <motion.div
                    key={team.id}
                    className="absolute cursor-pointer"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                    animate={{
                      x: s.x,
                      rotateY: s.rotateY,
                      scale: s.scale,
                      opacity: s.opacity,
                      filter: s.filter,
                      zIndex: s.zIndex,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.7 }}
                    onClick={() => isActive ? navigate(`/teams/${team.slug}`) : setSelectedIdx(i)}
                  >
                    {/* Card *\/}
                    <div
                      className="w-[140px] sm:w-[160px] rounded-2xl overflow-hidden"
                      style={{
                        background: `linear-gradient(180deg, ${team.color_hex}18 0%, #0d0d0d 50%, #0a0a0a 100%)`,
                        border: isActive ? `1.5px solid ${team.color_hex}50` : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: isActive
                          ? `0 8px 30px ${team.color_hex}20, 0 0 60px ${team.color_hex}08`
                          : '0 4px 16px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Glow behind active card *\/}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            background: `radial-gradient(circle at 50% 40%, ${team.color_hex}12 0%, transparent 70%)`,
                          }}
                        />
                      )}

                      {/* Logo *\/}
                      <div className="aspect-[3/4] flex items-center justify-center p-5 relative">
                        <img
                          src={`/images/logos/${getLogoFilename(team.slug)}`}
                          alt={team.name}
                          className="w-full h-full object-contain drop-shadow-md"
                          draggable={false}
                          loading="lazy"
                          style={{
                            filter: isActive ? `drop-shadow(0 0 8px ${team.color_hex}30)` : 'none',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Nav arrows *\/}
            <motion.button
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-20
                         w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08]
                         flex items-center justify-center text-white/40
                         hover:text-white hover:bg-white/[0.08] transition-all"
              onClick={goPrev}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous team"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </motion.button>
            <motion.button
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-20
                         w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08]
                         flex items-center justify-center text-white/40
                         hover:text-white hover:bg-white/[0.08] transition-all"
              onClick={goNext}
              whileTap={{ scale: 0.9 }}
              aria-label="Next team"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.button>
          </div>

          {/* Team name + dots below carousel *\/}
          <div className="flex flex-col items-center mt-4">
            <AnimatePresence mode="wait">
              {activeTeam && (
                <motion.div
                  key={selectedIdx}
                  className="text-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3
                    className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white uppercase"
                    style={{ fontFamily: '"Anton", sans-serif' }}
                  >
                    {activeTeam.name}
                  </h3>
                  <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mt-0.5">
                    HPL Season 3
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot indicators *\/}
            <div className="flex gap-1.5 mt-4">
              {teams.map((t, i) => (
                <button
                  key={t.id}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === selectedIdx ? 18 : 6,
                    height: 6,
                    background: i === selectedIdx ? t.color_hex : 'rgba(255,255,255,0.1)',
                  }}
                  onClick={() => setSelectedIdx(i)}
                  aria-label={`Select ${t.name}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: compact 3D jersey ===== *\/}
        <div className="w-full lg:w-2/5 flex flex-col items-center">
          <div className="relative w-full max-w-[320px]">
            {/* Decorative ring *\/}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-0">
              <motion.div
                className="w-[200px] h-[60px] rounded-[50%]"
                animate={{
                  borderColor: `${activeTeam?.color_hex || '#d4af37'}30`,
                  boxShadow: `0 0 20px ${activeTeam?.color_hex || '#d4af37'}10`,
                }}
                style={{
                  border: '1px solid',
                  transform: 'rotateX(75deg)',
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <Jersey3DViewer
              modelPath="/models/jersey/scene.gltf"
              teamColor={activeTeam?.color_hex || '#d4af37'}
              height={280}
            />
          </div>

          <motion.div
            className="mt-4"
            key={selectedIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MagneticButton
              variant="secondary"
              onClick={() => navigate(`/teams/${activeTeam?.slug}`)}
              id="view-team-merch"
            >
              <span className="flex items-center gap-2 text-sm">
                View {activeTeam?.name} Merch
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
</SectionReveal>
*/
