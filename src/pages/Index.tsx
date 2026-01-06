import { useState, useRef } from 'react';
import { useBingoCard } from '@/hooks/useBingoCard';
import { BingoCard } from '@/components/bingo/BingoCard';
import { EditSlotModal } from '@/components/bingo/EditSlotModal';
import { ActionButtons } from '@/components/bingo/ActionButtons';
import { BingoSlot } from '@/types/bingo';

const Index = () => {
  const { card, updateTitle, updateSlot, clearCard } = useBingoCard();
  const [editingSlot, setEditingSlot] = useState<BingoSlot | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSlotClick = (id: number) => {
    const slot = card.slots.find((s) => s.id === id);
    if (slot) setEditingSlot(slot);
  };

  const handleChangeTitle = (title: string) => {
    updateTitle(title);
  };

  const handleSaveSlot = (id: number, updates: Partial<BingoSlot>) => {
    updateSlot(id, updates);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex justify-center">
          <BingoCard
            ref={cardRef}
            card={card}
            onSlotClick={handleSlotClick}
            onChangeTitle={handleChangeTitle}
          />
        </div>

        <ActionButtons card={card} cardRef={cardRef} onClear={clearCard} />

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Rileran •{' '}
            <a
              className="hover:text-stone-400"
              href="https://github.com/rileran"
            >
              Github
            </a>
          </p>
        </footer>
      </div>

      <EditSlotModal
        slot={editingSlot}
        open={!!editingSlot}
        onOpenChange={(open) => !open && setEditingSlot(null)}
        onSave={handleSaveSlot}
      />
    </div>
  );
};

export default Index;
