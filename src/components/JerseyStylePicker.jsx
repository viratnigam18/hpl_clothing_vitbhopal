import { motion } from 'framer-motion';

/**
 * Garment cut silhouettes for the 3 styles
 */
function GarmentSilhouette({ type, className = '' }) {
  if (type === 'cricket') {
    // Shirt with polo collar lapels and buttons
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M6 3.5L2 8l3 2 1.5-2v11a1.5 1.5 0 001.5 1.5h8a1.5 1.5 0 001.5-1.5V8l1.5 2 3-2-4-4.5h-3.5L12 6.5 10.5 3.5H6z" />
        <path d="M8.5 3.5L12 8l3.5-4.5" />
        <line x1="12" y1="8" x2="12" y2="12" />
      </svg>
    );
  }

  if (type === 'football') {
    // Round neck collarless shirt
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M6 4L2 8.5l3 2 1.5-2v10a1.5 1.5 0 001.5 1.5h8a1.5 1.5 0 001.5-1.5V8.5l1.5 2 3-2L18 4h-4a2.5 2.5 0 01-4 0H6z" />
        <path d="M9.5 4a2.5 2.5 0 005 0" />
      </svg>
    );
  }

  // Basketball: sleeveless vest with scoop neck & armholes
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 4h2.5a2.5 2.5 0 005 0H17l1 5.5c-1.5 1-2 2.5-2 4.5v5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 018 19v-5c0-2-.5-3.5-2-4.5L7 4z" />
      <path d="M9.5 4a2.5 2.5 0 005 0" />
    </svg>
  );
}

/**
 * JerseyStylePicker — interactive selector for the 3 jersey options:
 * 1. Cricket Jersey (collar)
 * 2. Football without collar
 * 3. Basketball sleeve less
 */
export default function JerseyStylePicker({
  styles = [],
  selected,
  onSelect,
  teamColor = '#d4af37',
}) {
  if (!styles.length) return null;

  return (
    <div
      className="flex flex-col gap-2.5 sm:gap-3"
      role="radiogroup"
      aria-label="Select jersey style"
    >
      {styles.map((style) => {
        const isSelected = selected === style.id;
        const numberLabel = style.numberStr || `0${style.number}`;
        const titleText = `${numberLabel} · ${style.name}`;
        const subtitleText = style.subtitle || style.tag;

        return (
          <motion.button
            key={style.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(style.id)}
            whileTap={{ scale: 0.985 }}
            style={
              isSelected
                ? {
                    borderColor: teamColor || '#d4af37',
                    boxShadow: `0 0 22px ${teamColor}33`,
                  }
                : {}
            }
            className={`
              relative w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200
              focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
              ${isSelected
                ? 'bg-gold/10 border-gold'
                : 'bg-bg-elevated/80 border-white/10 hover:border-gold/40 hover:bg-bg-elevated text-text-secondary hover:text-text-primary'
              }
            `}
          >
            <div className="flex items-start gap-3.5">
              {/* Silhouette Icon */}
              <div
                className={`
                  w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mt-0.5
                  ${isSelected
                    ? 'text-gold'
                    : 'text-text-muted hover:text-text-secondary'
                  }
                `}
              >
                <GarmentSilhouette type={style.id} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              {/* Title, Subtitle & Description */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4
                    className={`
                      text-sm sm:text-base font-bold tracking-wide
                      ${isSelected ? 'text-text-primary' : 'text-text-primary/90'}
                    `}
                  >
                    {titleText}
                  </h4>

                  {/* Popular Badge */}
                  {style.isPopular && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-green-500/15 text-green-400 border border-green-500/30 flex-shrink-0">
                      Popular
                    </span>
                  )}
                </div>

                {/* Subtitle (e.g. CLASSIC POLO STYLE, COLLARLESS DESIGN, MAXIMUM MOBILITY) */}
                {subtitleText && (
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    {subtitleText}
                  </p>
                )}

                {/* Description Copy */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {style.description}
                </p>
              </div>

              {/* Radio Indicator */}
              <div className="flex items-center justify-center flex-shrink-0 pt-1">
                <div
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center transition-all
                    ${isSelected
                      ? 'bg-gold border-2 border-gold text-bg shadow-sm'
                      : 'border-2 border-white/20'
                    }
                  `}
                >
                  {isSelected ? (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="w-3.5 h-3.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3.5 8 6.5 11 12.5 5" />
                    </svg>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
