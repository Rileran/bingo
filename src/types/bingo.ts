import { AutocompleteResult } from '@/lib/backloggd';

export interface BingoSlot {
  id: number;
  title: string;
  game?: AutocompleteResult;
  imageUrl: string;
}

export interface BingoCard {
  title: string;
  slots: BingoSlot[];
}

export const createEmptyCard = (): BingoCard => ({
  title: 'Title',
  slots: Array.from({ length: 25 }, (_, i) => ({
    id: i,
    title: '',
    imageUrl: '',
  })),
});

export const encodeCardToUrl = (card: BingoCard): string => {
  const shorterCard = {
    title: card.title,
    titles: card.slots.map((card) => card.title),
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(shorterCard)));
  return `${window.location.origin}${window.location.pathname}?template=${encoded}`;
};

export const decodeUrlToTitles = (encoded: string): BingoCard | null => {
  try {
    const shortDecoded = JSON.parse(decodeURIComponent(atob(encoded)));
    if (shortDecoded?.titles?.length === 25) {
      return {
        title: shortDecoded.title,
        slots: shortDecoded?.titles?.map((title, id) => ({
          id,
          title,
          imageUrl: '',
        })),
      };
    }
    return null;
  } catch {
    return null;
  }
};
