import React from 'react';

import { Button } from '@app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { t } from '@lingui/core/macro';

interface PromptDialogProps {
  open: boolean;
  prompt: string;
  index: number;
  onAdd: (prompt: string) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const PromptDialog = ({
  open,
  prompt,
  index,
  onAdd,
  onCancel,
  isEditing = false,
}: PromptDialogProps) => {
  const [editingPrompt, setEditingPrompt] = React.useState(prompt);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setEditingPrompt(prompt);
  }, [prompt]);

  const handleAdd = (close: boolean) => {
    onAdd(editingPrompt);
    setEditingPrompt('');
    if (close) {
      onCancel();
    } else if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit Prompt ${index + 1}` : t`Add Prompt`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="prompt-input">{t`Prompt`}</Label>
          <Textarea
            id="prompt-input"
            ref={textareaRef}
            value={editingPrompt}
            onChange={(e) => setEditingPrompt(e.target.value)}
            placeholder="The quick brown {{animal1}} jumps over the lazy {{animal2}}."
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            {t`Tip: use the`} {'{{varname}}'} {t`syntax to add variables to your prompt.`}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            {t`Cancel`}
          </Button>
          {!isEditing && (
            <Button
              variant="secondary"
              onClick={() => handleAdd(false)}
              disabled={!editingPrompt}
            >{t`Add Another`}</Button>
          )}
          <Button onClick={() => handleAdd(true)} disabled={!editingPrompt}>
            {isEditing ? t`Save` : t`Add`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog;
