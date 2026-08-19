import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTeams } from '@/hooks/useTeams';
import { useProducts } from '@/hooks/useProducts';
import JerseyRack from '@/components/JerseyRack';
import SectionReveal from '@/components/SectionReveal';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter = searchParams.get('team') || '';

  const { teams } = useTeams();
  const { products, loading } = useProducts({
    teamSlug: teamFilter || undefined,
  });

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="container-hpl">
        {/* Header */}
        <SectionReveal>
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl text-text-primary mb-3">
              <span className="text-gradient-gold">Shop</span>
            </h1>
            <p className="text-text-secondary text-base">
              Official HPL merchandise for all 7 teams
            </p>
          </div>
        </SectionReveal>

        {/* Filter Bar — Team only */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              className={`
                px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold
                border transition-all duration-200
                ${!teamFilter
                  ? 'bg-gold/10 text-gold border-gold/30'
                  : 'bg-transparent text-text-secondary border-white/10 hover:border-gold/20 hover:text-text-primary'
                }
              `}
              onClick={() => setFilter('team', '')}
              whileTap={{ scale: 0.95 }}
            >
              All Teams
            </motion.button>
            {teams.map((team) => (
              <motion.button
                key={team.id}
                className={`
                  px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold
                  border transition-all duration-200
                  ${teamFilter === team.slug
                    ? 'border-gold/30 text-gold'
                    : 'bg-transparent text-text-secondary border-white/10 hover:border-gold/20 hover:text-text-primary'
                  }
                `}
                style={
                  teamFilter === team.slug
                    ? { backgroundColor: `${team.color_hex}15` }
                    : {}
                }
                onClick={() =>
                  setFilter('team', teamFilter === team.slug ? '' : team.slug)
                }
                whileTap={{ scale: 0.95 }}
              >
                {team.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Jersey Rack */}
        {!loading && products.length > 0 && (
          <SectionReveal>
            <JerseyRack products={products} />
          </SectionReveal>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-text-muted text-lg">No jerseys found</p>
            <button
              className="text-gold text-sm underline hover:text-gold-bright"
              onClick={() => setSearchParams({})}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
