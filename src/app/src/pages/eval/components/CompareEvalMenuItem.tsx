import { DropdownMenuItem, DropdownMenuItemIcon } from '@app/components/ui/dropdown-menu';
import { t } from '@lingui/core/macro';
import { GitCompareArrows } from 'lucide-react';

interface CompareEvalMenuItemProps {
  onClick: () => void;
}

function CompareEvalMenuItem({ onClick }: CompareEvalMenuItemProps) {
  return (
    <DropdownMenuItem onSelect={onClick}>
      <DropdownMenuItemIcon>
        <GitCompareArrows className="size-4" />
      </DropdownMenuItemIcon>
      {t`Compare with another eval`}
    </DropdownMenuItem>
  );
}

export default CompareEvalMenuItem;
