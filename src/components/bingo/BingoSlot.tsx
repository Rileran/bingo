import { cn } from '@/lib/utils';
import { BingoSlot as BingoSlotType } from '@/types/bingo';
import { Plus, ImageIcon } from 'lucide-react';

interface BingoSlotProps {
  slot: BingoSlotType;
  onClick: () => void;
  colorIndex: number;
}

export const BingoSlot = ({ slot, onClick, colorIndex }: BingoSlotProps) => {
  const isEmpty = !slot.title && !slot.imageUrl;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative aspect-[0.75] w-full overflow-hidden rounded-lg border-2 bg-card transition-all duration-200',
        'hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isEmpty && 'border-dashed'
      )}
    >
      {isEmpty ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Plus className="h-6 w-6" />
          <span className="text-xs">Add</span>
        </div>
      ) : (
        <>
          <div className="absolute inset-0">
            {slot.imageUrl ? (
              <img
                src={slot.imageUrl}
                alt={slot.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground/50">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
          </div>

          {slot.title && (
            <div className="pointer-events-none absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-3 py-2">
              <p
                className="line-clamp-2 text-center text-sm font-semibold leading-snug text-white"
                style={{
                  textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                }}
              >
                {slot.title}
              </p>
            </div>
          )}
        </>
      )}
    </button>
  );
};
