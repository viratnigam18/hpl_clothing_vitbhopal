import { motion } from 'framer-motion';

/**
 * SizePicker — toggle group for garment sizes.
 * Greys out out-of-stock sizes.
 *
 * @param {object} props
 * @param {{ size: string, stock_qty: number }[]} props.variants
 * @param {string} props.selected — currently selected size
 * @param {function} props.onSelect — callback(size)
 */
export default function SizePicker({ variants = [], selected, onSelect }) {
  if (!variants.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
      {variants.map((v) => {
        const inStock = v.stock_qty > 0;
        const isSelected = selected === v.size;

        return (
          <motion.button
            key={v.size}
            className={`
              relative w-12 h-12 rounded-lg text-sm font-semibold
              border transition-colors duration-200
              focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
              ${isSelected
                ? 'bg-gold text-bg border-gold'
                : inStock
                  ? 'bg-bg-elevated text-text-primary border-white/10 hover:border-gold/40'
                  : 'bg-bg-elevated text-text-muted/30 border-white/5 cursor-not-allowed line-through'
              }
            `}
            disabled={!inStock}
            onClick={() => onSelect(v.size)}
            whileTap={inStock ? { scale: 0.93 } : {}}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Size ${v.size}${!inStock ? ', out of stock' : ''}`}
          >
            {v.size}
          </motion.button>
        );
      })}
    </div>
  );
}
