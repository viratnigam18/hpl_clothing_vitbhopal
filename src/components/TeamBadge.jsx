import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * TeamBadge — circular crest with team-color glow on hover.
 * Click navigates to the team page.
 */
export default function TeamBadge({ team, size = 'md' }) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();

  const sizes = {
    sm: 'w-14 h-14 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-28 h-28 text-base',
  };

  // Generate initials from team name (e.g., "Kabini Lynx" → "KL")
  const initials = team.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <motion.button
      className={`
        ${sizes[size]}
        relative rounded-full flex items-center justify-center
        font-heading uppercase tracking-wider
        border-2 border-white/10
        transition-colors duration-300
        glow-ring cursor-pointer
        focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
      `}
      style={{
        '--glow-color': `${team.color_hex}66`,
        backgroundColor: `${team.color_hex}15`,
        color: team.color_hex,
      }}
      whileHover={
        prefersReduced
          ? { borderColor: team.color_hex }
          : {
              scale: 1.1,
              borderColor: team.color_hex,
              boxShadow: `0 0 30px ${team.color_hex}44, 0 0 60px ${team.color_hex}22`,
            }
      }
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/teams/${team.slug}`)}
      aria-label={`View ${team.name} merchandise`}
      title={team.name}
    >
      {team.crest_url ? (
        <img
          src={team.crest_url}
          alt={team.name}
          className="w-3/4 h-3/4 object-contain"
          loading="lazy"
        />
      ) : (
        <span className="font-heading font-bold">{initials}</span>
      )}
    </motion.button>
  );
}
