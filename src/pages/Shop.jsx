import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTeams } from '@/hooks/useTeams';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import JerseyRack from '@/components/JerseyRack';
import TeamBadge from '@/components/TeamBadge';
import SectionReveal from '@/components/SectionReveal';

const PRODUCT_TYPES = [
  { value: '', label: 'All' },
  { value: 'jersey', label: 'Jerseys' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'tee', label: 'Tees' },
  { value: 'cap', label: 'Caps' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter = searchParams.get('team') || '';
  const typeFilter = searchParams.get('type') || '';

  const { teams } = useTeams();
  const { products, loading } = useProducts({
    teamSlug: teamFilter || undefined,
    type: typeFilter || undefined,
  });

  // Separate jerseys for the rack
  const jerseys = useMemo(
    () => products.filter((p) => p.type === 'jersey'),
    [products]
  );
  const nonJerseys = useMemo(
    () => products.filter((p) => p.type !== 'jersey'),
    [products]
  );

  // Should we show the rack? Only when type filter is '' (all) or 'jersey'
  const showRack = typeFilter === '' || typeFilter === 'jersey';
  // Should we show the grid? When there are non-jersey products or type is specifically not jersey
  const showGrid =
    typeFilter === '' ? nonJerseys.length > 0 : typeFilter !== 'jersey';
  const gridProducts = typeFilter === '' ? nonJerseys : products;

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

        {/* Filter Bar */}
        <div className="mb-10 space-y-6">
          {/* Team filter */}
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

          {/* Type filter */}
          <div className="flex items-center justify-center gap-2">
            {PRODUCT_TYPES.map((t) => (
              <button
                key={t.value}
                className={`
                  px-5 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${typeFilter === t.value
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-text-secondary hover:text-text-primary border border-transparent'
                  }
                `}
                onClick={() => setFilter('type', t.value)}
              >
                {t.label}
              </button>
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
        {!loading && showRack && jerseys.length > 0 && (
          <SectionReveal className="mb-16">
            <h2 className="text-2xl sm:text-3xl text-text-primary mb-8 text-center">
              <span className="text-gradient-gold">Jerseys</span>
            </h2>
            <JerseyRack products={jerseys} />
          </SectionReveal>
        )}

        {/* Product Grid (non-jersey items, or when type filter is set) */}
        {!loading && showGrid && gridProducts.length > 0 && (
          <SectionReveal>
            {typeFilter === '' && (
              <h2 className="text-2xl sm:text-3xl text-text-primary mb-8">
                More <span className="text-gradient-gold">Gear</span>
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {gridProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </SectionReveal>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-text-muted text-lg">No products found</p>
            <button
              className="text-gold text-sm underline hover:text-gold-bright"
              onClick={() => {
                setSearchParams({});
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
