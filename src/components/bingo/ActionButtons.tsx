import { useState } from 'react';
import { toSvg } from 'html-to-image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BingoCard, encodeCardToUrl } from '@/types/bingo';
import { Share2, Download, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ActionButtonsProps {
  card: BingoCard;
  cardRef: React.RefObject<HTMLDivElement>;
  onClear: () => void;
}

export const ActionButtons = ({
  card,
  cardRef,
  onClear,
}: ActionButtonsProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleShare = async () => {
    const url = encodeCardToUrl(card);
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Template link copied!', {
        description: `Only titles will be shared`,
      });
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleExport = async () => {
    if (!cardRef.current) return;

    try {
      toast.loading('Generating image...', { id: 'export' });

      const dataUrl = await toSvg(cardRef.current, {
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${card.title.toLowerCase()}.svg`;
      link.href = dataUrl;
      link.click();

      toast.success('Bingo card downloaded!', { id: 'export' });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export image', { id: 'export' });
    }
  };

  const handleClear = () => {
    if (card.slots.some((s) => s.title || s.imageUrl)) {
      setIsConfirmOpen(true);
    }
  };

  const confirmClear = () => {
    onClear();
    toast.success('Card cleared');
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="fixed right-4 top-1/2 flex -translate-y-1/2 flex-col gap-3 z-50">
        <Button
          onClick={handleShare}
          className="h-12 w-12 p-0 rounded-full flex items-center justify-center"
          variant="secondary"
          title="Share Template"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        <Button
          onClick={handleExport}
          className="h-12 w-12 p-0 rounded-full flex items-center justify-center"
          variant="secondary"
          title="Export PNG"
        >
          <Download className="h-5 w-5" />
        </Button>

        <Button
          onClick={handleClear}
          className="h-12 w-12 p-0 rounded-full flex items-center justify-center text-destructive"
          variant="secondary"
          title="Clear Card"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Clear Bingo Card?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to clear the
              card?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClear}>
              Clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
