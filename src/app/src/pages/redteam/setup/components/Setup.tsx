import { Button } from '@app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { t } from '@lingui/core/macro';
import { ChevronRight } from 'lucide-react';

interface SetupProps {
  open: boolean;
  onClose: () => void;
}

export default function Setup({ open, onClose }: SetupProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[calc(100vh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t`LLM Red Team Configuration Setup`}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 space-y-3 overflow-y-auto py-2 pr-1 sm:space-y-4 sm:py-4">
          <p className="text-sm text-foreground">{t`You are about to set up several components that define how your AI system will be tested:`}</p>
          <ul className="list-disc space-y-1.5 pl-6 text-sm sm:space-y-2">
            <li>
              <strong>{t`Application:`}</strong>{' '}
              {t`Metadata used to tailor the adversarial inputs to your application.`}
            </li>
            <li>
              <strong>{t`Targets:`}</strong>{' '}
              {t`The specific endpoints, models, or components of your AI system that will be tested.`}
            </li>
            <li>
              <strong>{t`Plugins:`}</strong>{' '}
              {t`Modules that generate diverse adversarial inputs, simulating various types of attacks or edge cases.`}
            </li>
            <li>
              <strong>{t`Strategies:`}</strong>{' '}
              {t`Define how adversarial inputs are delivered to your system, including techniques like jailbreaking and prompt injection.`}
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <a
            href="https://www.promptfoo.dev/docs/red-team/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >{t`Learn more about LLM red teaming`}</a>
          <Button onClick={onClose} className="shrink-0 px-6">
            {t`Get Started`}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
