import { useState, useEffect, useCallback } from 'react';
import {
  BingoCard,
  BingoSlot,
  createEmptyCard,
  decodeUrlToTitles,
} from '@/types/bingo';
import { useLocalStorage } from './use-localstorage';

export const useBingoCard = () => {
  const [card, setCard] = useLocalStorage<BingoCard>('card', createEmptyCard());
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const template = params.get('template');

    if (template) {
      const card = decodeUrlToTitles(template);
      if (card) {
        setCard(card);
        setIsTemplateLoaded(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [setCard]);

  const updateSlot = useCallback(
    (id: number, updates: Partial<BingoSlot>) => {
      setCard(({ slots, ...rest }) => ({
        slots: slots.map((slot) =>
          slot.id === id ? { ...slot, ...updates } : slot
        ),
        ...rest,
      }));
    },
    [setCard]
  );

  const updateTitle = useCallback(
    (title: string) => {
      setCard((card) => ({ ...card, title }));
    },
    [setCard]
  );

  const clearCard = useCallback(() => {
    setCard(createEmptyCard());
    setIsTemplateLoaded(false);
  }, [setCard]);

  return {
    card,
    updateTitle,
    updateSlot,
    clearCard,
    isTemplateLoaded,
  };
};
