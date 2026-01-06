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
import { ImageIcon } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slot) {
      setTitle(slot.title);
      setImageUrl(slot.imageUrl);
    }
  }, [slot]);

  const handleSave = () => {
    if (!slot) return;

    if (imageUrl) {
      try {
        const url = new URL(imageUrl);

        if (!url.hostname.endsWith('igdb.com')) {
          setError('Image URL must be from igdb.com');
          return;
        }
      } catch {
        setError('Image URL is not a valid URL');
        return;
      }
    }

    setError(null);
    onSave(slot.id, { title, imageUrl });
    onOpenChange(false);
  };

  const handleClear = () => {
    if (slot) {
      onSave(slot.id, { title: '', imageUrl: '' });
      onOpenChange(false);
    }
  };

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
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Escort Mission, Water Level"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="Paste image URL here... (only igdb.com)"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Clear
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
