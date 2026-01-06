import { useState, useEffect } from 'react';
import { BingoSlot } from '@/types/bingo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, Loader2 } from 'lucide-react';
import { useDebounced } from '@/hooks/use-bebounced';
import {
  autocomplete,
  AutocompleteResult,
  fetchImageUrl,
} from '@/lib/backloggd';

interface EditSlotModalProps {
  slot: BingoSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, updates: Partial<BingoSlot>) => void;
}

export const EditSlotModal = ({
  slot,
  open,
  onOpenChange,
  onSave,
}: EditSlotModalProps) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [options, setOptions] = useState<AutocompleteResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<
    AutocompleteResult | undefined
  >(undefined);

  useEffect(() => {
    if (slot) {
      setTitle(slot.title);
      setImageUrl(slot.imageUrl);
      setSearch('');
      setSelectedOption(slot.game);
    }
  }, [slot]);

  const handleSave = () => {
    if (!slot) return;
    onSave(slot.id, { title, imageUrl, game: selectedOption });
    onOpenChange(false);
  };

  const handleClear = () => {
    if (!slot) return;
    onSave(slot.id, { title: '', imageUrl: '' });
    onOpenChange(false);
  };

  const handleSelect = (option: AutocompleteResult) => {
    setSelectedOption(option);
    setOptions([]);
  };

  useEffect(() => {
    if (!debouncedSearch) return;
    setIsLoading(true);
    const f = async () => {
      try {
        const res = await autocomplete(debouncedSearch);
        setOptions(res);
      } catch (e) {
        console.error('Could not fetch autocomplete', e);
      }
      setIsLoading(false);
    };
    f();
  }, [debouncedSearch]);

  useEffect(() => {
    if (!selectedOption) return;
    setIsImageLoading(true);
    const f = async () => {
      try {
        const image = await fetchImageUrl(selectedOption.data.slug);
        setImageUrl(image);
      } catch (e) {
        console.error('Could not fetch image', e);
      }
      setIsImageLoading(false);
    };
    f();
  }, [selectedOption]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Edit Slot {slot ? slot.id + 1 : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="mx-auto aspect-[3/4] w-32 overflow-hidden rounded-lg border-2 border-primary/30 bg-muted">
            {isImageLoading && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {!isImageLoading && !imageUrl && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
            {!isImageLoading && !!imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageSearch">Select Game</Label>
            <div className="relative">
              {selectedOption ? (
                <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                  <span className="flex-1 text-sm text-muted-foreground">
                    {selectedOption.value} ({selectedOption.data.year})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOption(undefined);
                      setImageUrl('');
                      setSearch('');
                    }}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <Input
                  id="imageSearch"
                  placeholder="Search game..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}

              {isLoading && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {options.length > 0 && (
              <div className="max-h-48 overflow-auto rounded-md border">
                {options.map((option) => (
                  <button
                    key={option.data.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted"
                  >
                    <span className="text-sm">
                      {option.data.title} ({option.data.year})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Clear
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={isLoading || isImageLoading}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
