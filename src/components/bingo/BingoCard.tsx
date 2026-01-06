import { forwardRef, useState } from 'react';
import { BingoCard as BingoCardType } from '@/types/bingo';
import { BingoSlot } from './BingoSlot';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

interface BingoCardProps {
  card: BingoCardType;
  onSlotClick: (id: number) => void;
  onChangeTitle: (title: string) => void;
}

export const BingoCard = forwardRef<HTMLDivElement, BingoCardProps>(
  ({ card, onSlotClick, onChangeTitle }, ref) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleBlur = () => setIsEditing(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') setIsEditing(false);
    };

    return (
      <div
        ref={ref}
        className="w-full max-w-2xl rounded-2xl bg-card p-2 shadow-card"
      >
        <div className="mb-4 flex items-center justify-center gap-2 relative group">
          {isEditing ? (
            <Input
              className="text-3xl sm:text-4xl font-extrabold text-center rounded-none"
              value={card.title}
              onChange={(e) => onChangeTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-center pb-1">
                {card.title}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-5 gap-0.5">
          {card.slots.map((slot, index) => (
            <BingoSlot
              key={slot.id}
              slot={slot}
              onClick={() => onSlotClick(slot.id)}
              colorIndex={index}
            />
          ))}
        </div>
      </div>
    );
  }
);

BingoCard.displayName = 'BingoCard';
