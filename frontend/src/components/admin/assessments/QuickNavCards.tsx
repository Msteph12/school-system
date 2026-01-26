import React from 'react';

interface QuickNavCard {
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

interface QuickNavCardsProps {
  cards: QuickNavCard[];
}

const QuickNavCards: React.FC<QuickNavCardsProps> = ({ cards }) => {
  return (
    <div className="space-y-6">
      {/* First three cards - larger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.slice(0, 3).map((card, index) => (
          <button
            key={index}
            onClick={card.onClick}
            className={`relative rounded-2xl p-7 text-left bg-gradient-to-br ${card.gradient} shadow-lg min-h-[180px]`}
          >
            <div className="space-y-3 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white/70 mb-2">{card.title}</h3>
                <p className="text-white text-lg font-medium leading-snug">{card.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Last four cards - smaller, in one row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.slice(3).map((card, index) => (
          <button
            key={index + 3}
            onClick={card.onClick}
            className={`relative rounded-xl p-5 text-left bg-gradient-to-br ${card.gradient} shadow-lg min-h-[140px]`}
          >
            <div className="space-y-2 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white/60 mb-1">{card.title}</h3>
                <p className="text-white text-base font-medium leading-tight">{card.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickNavCards;