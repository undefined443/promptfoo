import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@app/components/ui/tooltip';
import { cn } from '@app/lib/utils';
import { t } from '@lingui/core/macro';
import type { EvalResultsFilterMode } from '@promptfoo/types';

interface FilterModeSelectorProps {
  filterMode: EvalResultsFilterMode;
  onChange: (value: EvalResultsFilterMode) => void;
  showDifferentOption?: boolean;
}

export const FilterModeSelector = ({
  filterMode,
  onChange,
  showDifferentOption = true,
}: FilterModeSelectorProps) => {
  const BASE_OPTIONS: { value: EvalResultsFilterMode; label: string; tooltip: string }[] = [
    { value: 'all', label: t`All results`, tooltip: t`Show all test results` },
    {
      value: 'failures',
      label: t`Failures only`,
      tooltip: t`Show only tests that failed assertions`,
    },
    {
      value: 'passes',
      label: t`Passes only`,
      tooltip: t`Show only tests that passed all assertions`,
    },
    { value: 'errors', label: t`Errors only`, tooltip: t`Show only tests that encountered errors` },
    {
      value: 'different',
      label: t`Different outputs`,
      tooltip: t`Show only tests with different outputs across providers`,
    },
    { value: 'highlights', label: t`Highlights only`, tooltip: t`Show only highlighted results` },
    {
      value: 'user-rated',
      label: t`User-rated only`,
      tooltip: t`Show only results with manual user ratings (thumbs up/down)`,
    },
  ];

  const TOGGLE_LABELS: Record<EvalResultsFilterMode, string> = {
    all: t`All`,
    failures: t`Failures`,
    passes: t`Passes`,
    errors: t`Errors`,
    different: t`Different`,
    highlights: t`Highlights`,
    'user-rated': t`User-rated`,
  };

  const options = showDifferentOption
    ? BASE_OPTIONS
    : BASE_OPTIONS.filter((o) => o.value !== 'different');

  return (
    <>
      {/* Mobile: dropdown */}
      <div className="md:hidden">
        <Select value={filterMode} onValueChange={onChange}>
          <SelectTrigger aria-label={t`Filter results`} className="w-[140px] h-8 text-xs">
            <SelectValue placeholder={t`All results`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: toggle chips */}
      <div className="hidden md:flex items-center gap-0.5 rounded-lg bg-muted/60 p-1">
        {options.map((option) => (
          <Tooltip key={option.value} disableHoverableContent>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={filterMode === option.value}
                className={cn(
                  'px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  filterMode === option.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
                )}
              >
                {TOGGLE_LABELS[option.value]}
              </button>
            </TooltipTrigger>
            <TooltipContent>{option.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </>
  );
};
