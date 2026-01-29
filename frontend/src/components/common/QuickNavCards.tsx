import React from 'react';
import type { QuickNavCard } from '@/types/result';

interface QuickNavCardsProps {
  cards: QuickNavCard[];
}

const QuickNavCards: React.FC<QuickNavCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={card.onClick}
          className="relative h-32 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          aria-label={`Navigate to ${card.title}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              card.onClick();
            }
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
          <div className="relative h-full p-5 flex flex-col justify-end text-white">
            <p className="text-lg font-bold">{card.title}</p>
            <p className="text-sm opacity-90 mt-1">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickNavCards;