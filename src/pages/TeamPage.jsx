import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTeams } from '@/hooks/useTeams';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import SectionReveal from '@/components/SectionReveal';

export default function TeamPage() {
  const { slug } = useParams();
  const { teams } = useTeams();
  const { products, loading } = useProducts({ teamSlug: slug });

  const team = teams.find((t) => t.slug === slug);

  if (!team && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-muted text-lg">Team not found</p>
      </div>
    );
  }

  const teamColor = team?.color_hex || '#d4af37';

  return (
    <div>
      {/* ====== HERO with team color wash ====== */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{ '--team-color': teamColor }}
      >
        {/* Team color gradient wash */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 30%, ${teamColor}18 0%, transparent 70%),
              linear-gradient(180deg, ${teamColor}08 0%, var(--color-bg) 100%)
            `,
          }}
        />
        {/* Bottom edge glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${teamColor}40, transparent)`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Team badge — glow-in on load */}
          <motion.div
            className="w-48 sm:w-60 rounded-2xl overflow-hidden border-2 flex items-center justify-center mb-6"
            style={{
              borderColor: `${teamColor}50`,
              backgroundColor: `${teamColor}10`,
              boxShadow: `0 0 40px ${teamColor}25, 0 0 80px ${teamColor}10`,
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {team?.crest_url ? (
              <img
                src={team.crest_url}
                alt={team.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="font-heading text-3xl sm:text-4xl py-8"
                style={{ color: teamColor }}
              >
                {team?.name
                  ?.split(' ')
                  .map((w) => w[0])
                  .join('') || '?'}
              </span>
            )}
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl text-text-primary mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {team?.name || 'Loading...'}
          </motion.h1>

          <motion.p
            className="text-text-secondary text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Official {team?.name} merchandise
          </motion.p>
        </div>
      </section>

      {/* ====== PRODUCTS ====== */}
      <section className="py-12 sm:py-16">
        <div className="container-hpl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <SectionReveal>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </SectionReveal>
          ) : (
            <div className="text-center py-20 text-text-muted">
              No products available for this team yet
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
