import { useState, useEffect, useCallback } from 'react';
import {
  BingoCard,
  BingoSlot,
  createEmptyCard,
  decodeUrlToTitles,
} from '@/types/bingo';

export const useBingoCard = () => {
  const [card, setCard] = useState<BingoCard>(createEmptyCard);
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
  }, []);

  const updateSlot = useCallback((id: number, updates: Partial<BingoSlot>) => {
    setCard(({ slots, ...rest }) => ({
      slots: slots.map((slot) =>
        slot.id === id ? { ...slot, ...updates } : slot
      ),
      ...rest,
    }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setCard((card) => ({ ...card, title }));
  }, []);

  const clearCard = useCallback(() => {
    setCard(createEmptyCard());
    setIsTemplateLoaded(false);
  }, []);

  return {
    card,
    updateTitle,
    updateSlot,
    clearCard,
    isTemplateLoaded,
  };
};
