import { motion } from 'framer-motion';
import SectionReveal from '@/components/SectionReveal';

export default function About() {
  return (
    <div className="py-12 sm:py-20">
      <div className="container-hpl max-w-3xl">
        <SectionReveal>
          <div className="text-center mb-16">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl text-text-primary mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About <span className="text-gradient-gold">HPL</span>
            </motion.h1>
            <motion.div
              className="w-16 h-0.5 bg-gold mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg">
              The <span className="text-gold font-semibold">HPL (House Premier League)</span> is VIT Bhopal's flagship inter-house sports tournament — a celebration of athleticism, team spirit, and campus pride.
            </p>

            <p>
              Seven teams. Seven identities. One league. Each team carries the legacy of its house, competing across multiple sports disciplines throughout the academic year. The HPL isn't just about winning — it's about belonging.
            </p>

            <p>
              <span className="text-gold">HPL Clothing</span> is the official merchandise arm of the league. We design and produce premium-quality jerseys, hoodies, tees, and caps for every HPL team, giving students a way to wear their team pride on and off the field.
            </p>

            <p>
              Every piece of merch is designed with attention to detail — from the team colors to the fabric quality. Because when you wear your team's jersey, you're not just wearing a shirt. You're making a statement.
            </p>
          </div>
        </SectionReveal>

        {/* The 7 Teams */}
        <SectionReveal delay={0.2}>
          <div className="mt-16 p-8 rounded-2xl bg-bg-card border border-white/5">
            <h2 className="text-2xl text-text-primary mb-6 text-center">
              The <span className="text-gradient-gold">7 Teams</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Kabini Lynx', color: '#8E44AD' },
                { name: 'Ken Cheetahs', color: '#E67E22' },
                { name: 'Shimsha Panthers', color: '#2C3E50' },
                { name: 'Tons Tigers', color: '#F39C12' },
                { name: 'Orsang Leopards', color: '#C0392B' },
                { name: 'Arkavati Lions', color: '#2980B9' },
                { name: 'Harangi Jaguars', color: '#27AE60' },
              ].map((team) => (
                <div
                  key={team.name}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors"
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-text-primary font-medium text-sm">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-text-muted text-sm mb-4">
              For full fixtures, results, and league standings
            </p>
            <a
              href="https://www.hplvitbhopal.site"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-bright transition-colors text-sm font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Official HPL Site (hplvitbhopal.site)
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
