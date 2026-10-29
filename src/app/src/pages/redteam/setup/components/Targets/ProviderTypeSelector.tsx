import { Fragment, useEffect, useMemo, useState } from 'react';

import { Input } from '@app/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@app/components/ui/tooltip';
import { useTelemetry } from '@app/hooks/useTelemetry';
import { cn } from '@app/lib/utils';
import { t } from '@lingui/core/macro';
import { CheckCircle, HelpCircle, Search, X } from 'lucide-react';
import {
  hasCustomOpenAiBaseUrl,
  isLocalOpenAiProviderType,
  isOpenAiChatProviderId,
  withLocalProviderType,
} from './helpers';
import { allProviderOptions, createDefaultProvider } from './providerCatalog';
import { hasSpecificDocumentation } from './providerDocumentationMap';

import type { ProviderOptions } from '../../types';

interface ProviderTypeSelectorProps {
  provider: ProviderOptions | undefined;
  setProvider: (provider: ProviderOptions, providerType: string) => void;
  availableProviderIds?: string[];
  disableModelSelection?: boolean;
  providerType?: string;
}

export default function ProviderTypeSelector({
  provider,
  providerType,
  setProvider,
  availableProviderIds,
  disableModelSelection = false,
}: ProviderTypeSelectorProps) {
  const { recordEvent } = useTelemetry();

  const [selectedProviderType, setSelectedProviderType] = useState<string | undefined>(
    providerType,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  useEffect(() => {
    setSelectedProviderType(providerType);
  }, [providerType]);

  const descriptions = useMemo<Record<string, string>>(
    () => ({
      'Connect to your REST API or HTTP endpoint': t`Connect to your REST API or HTTP endpoint`,
      'Real-time WebSocket connections': t`Real-time WebSocket connections`,
      'Connect to Agent2Agent HTTP+JSON agents': t`Connect to Agent2Agent HTTP+JSON agents`,
      'Custom Python script or integration': t`Custom Python script or integration`,
      'Custom JS/TS script or integration': t`Custom JS/TS script or integration`,
      'Custom Go integration': t`Custom Go integration`,
      'Execute shell scripts or CLI commands': t`Execute shell scripts or CLI commands`,
      'Test web apps via browser automation': t`Test web apps via browser automation`,
      'Any other target via a custom provider': t`Any other target via a custom provider`,
      "Anthropic's official SDK for building agents": t`Anthropic's official SDK for building agents`,
      "OpenAI's official agent framework": t`OpenAI's official agent framework`,
      'Local coding agent with sandbox and approval controls': t`Local coding agent with sandbox and approval controls`,
      'Evaluate security scans, finding validation, model reasoning, and cost': t`Evaluate security scans, finding validation, model reasoning, and cost`,
      'Popular framework for LLM applications': t`Popular framework for LLM applications`,
      'Stateful, multi-actor agent applications': t`Stateful, multi-actor agent applications`,
      'Multi-agent orchestration framework': t`Multi-agent orchestration framework`,
      'Type-safe agents with structured outputs': t`Type-safe agents with structured outputs`,
      'RAG and data framework for LLM apps': t`RAG and data framework for LLM apps`,
      'Google AI Development Kit': t`Google AI Development Kit`,
      'Model Context Protocol for tool use': t`Model Context Protocol for tool use`,
      'Any other agent framework via custom provider': t`Any other agent framework via custom provider`,
      'GPT-6.1 Sol, GPT-6 Luna and Astra, and GPT-5.6 Terra': t`GPT-6.1 Sol, GPT-6 Luna and Astra, and GPT-5.6 Terra`,
      'Claude Sonnet, Opus, and Haiku models': t`Claude Sonnet, Opus, and Haiku models`,
      'Gemini models via Google AI': t`Gemini models via Google AI`,
      'Mistral and Mixtral models': t`Mistral and Mixtral models`,
      'DeepSeek V4.1 Flash and V4 Pro models': t`DeepSeek V4.1 Flash and V4 Pro models`,
      'Command and embedding models': t`Command and embedding models`,
      'Jamba and Jurassic models': t`Jamba and Jurassic models`,
      'Grok models from X.AI': t`Grok models from X.AI`,
      'Search-augmented AI with citations': t`Search-augmented AI with citations`,
      'OpenAI models on Azure': t`OpenAI models on Azure`,
      'Gemini on Google Cloud': t`Gemini on Google Cloud`,
      'Multiple models on AWS': t`Multiple models on AWS`,
      'Custom model endpoints on AWS': t`Custom model endpoints on AWS`,
      'Ultra-fast inference API': t`Ultra-fast inference API`,
      'Unified API for 200+ models': t`Unified API for 200+ models`,
      'Fast inference for open models': t`Fast inference for open models`,
      'Open-source model inference': t`Open-source model inference`,
      'High-speed Llama inference': t`High-speed Llama inference`,
      'Fast open model inference': t`Fast open model inference`,
      'Access 300+ AI models': t`Access 300+ AI models`,
      'Inference API for thousands of models': t`Inference API for thousands of models`,
      'Edge AI inference': t`Edge AI inference`,
      'Foundation Model APIs': t`Foundation Model APIs`,
      'Run open-source models': t`Run open-source models`,
      'Image generation models': t`Image generation models`,
      'Embedding models': t`Embedding models`,
      'Easy local model runner': t`Easy local model runner`,
      'High-performance inference server': t`High-performance inference server`,
      'Lightweight CPU/GPU inference': t`Lightweight CPU/GPU inference`,
      'OpenAI-compatible local API': t`OpenAI-compatible local API`,
      'Single-file executable models': t`Single-file executable models`,
      'Gradio-based model interface': t`Gradio-based model interface`,
    }),
    [],
  );

  // Tag filter options - 4 categories based on user intent
  type TagKey = 'app' | 'agents' | 'providers' | 'local';
  const tagFilters: Array<{ key: TagKey; label: string }> = [
    { key: 'app', label: t`My Application` },
    { key: 'agents', label: t`Agent Frameworks` },
    { key: 'providers', label: t`AI Providers` },
    { key: 'local', label: t`Local Models` },
  ];

  // Handle tag filter toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTag(tag);

    // Track tag filter usage
    recordEvent('feature_used', {
      feature: 'redteam_provider_tag_filtered',
      tag: tag,
    });
  };

  // Handle provider type selection
  const handleProviderTypeSelect = (value: string) => {
    if (disableModelSelection) {
      return;
    }
    setSelectedProviderType(value);

    const currentLabel = provider?.label;

    // Find the selected option to get its details
    const selectedOption = allProviderOptions.find((option) => option.value === value);

    // Track provider type selection
    recordEvent('feature_used', {
      feature: 'redteam_provider_type_selected',
      provider_type: value,
      provider_label: selectedOption?.label,
      provider_tag: selectedOption?.tag,
    });

    if (
      isLocalOpenAiProviderType(value) &&
      provider &&
      isOpenAiChatProviderId(provider.id) &&
      (providerType === value ||
        (!isLocalOpenAiProviderType(providerType) && hasCustomOpenAiBaseUrl(provider.config)))
    ) {
      setProvider(
        { ...provider, config: withLocalProviderType(provider.id, provider.config, value) },
        value,
      );
      return;
    }
    setProvider(
      provider && providerType === value ? provider : createDefaultProvider(value, currentLabel),
      value,
    );
  };

  // Filter available options if availableProviderIds is provided, by search term, and by tag
  const filteredProviderOptions = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return allProviderOptions.filter((option) => {
      const isAvailable = !availableProviderIds || availableProviderIds.includes(option.value);
      const matchesSearch =
        !normalizedSearch ||
        option.label.toLowerCase().includes(normalizedSearch) ||
        option.description.toLowerCase().includes(normalizedSearch) ||
        (descriptions[option.description] ?? '').toLowerCase().includes(normalizedSearch);
      const matchesTag = !selectedTag || option.tag === selectedTag;

      return isAvailable && matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag, availableProviderIds, descriptions]);

  // Calculate counts for each tag
  const getTagCount = (tagKey: TagKey | undefined) => {
    if (tagKey === undefined) {
      return allProviderOptions.filter(
        (opt) => !availableProviderIds || availableProviderIds.includes(opt.value),
      ).length;
    }
    return allProviderOptions.filter(
      (opt) =>
        opt.tag === tagKey && (!availableProviderIds || availableProviderIds.includes(opt.value)),
    ).length;
  };

  return (
    <div className="space-y-4">
      {/* Filter bar - chips on left, search on right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTag(undefined)}
            disabled={disableModelSelection}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              selectedTag === undefined
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground enabled:hover:border-primary/50 enabled:hover:bg-primary/5',
            )}
          >
            {t`All`} ({getTagCount(undefined)})
          </button>
          {tagFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => handleTagToggle(filter.key)}
              disabled={disableModelSelection}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selectedTag === filter.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground enabled:hover:border-primary/50 enabled:hover:bg-primary/5',
              )}
            >
              {filter.label} ({getTagCount(filter.key)})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 sm:shrink-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label={t`Search providers`}
            placeholder={t`Search providers...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disableModelSelection}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              type="button"
              aria-label={t`Clear provider search`}
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Provider list */}
      <div className="space-y-2">
        {filteredProviderOptions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">{t`No providers found matching your search.`}</p>
          </div>
        ) : (
          filteredProviderOptions.map((option, index) => {
            // Check if we need to show a divider before this option
            const tier2Providers = ['openai', 'google', 'anthropic', 'openrouter'];
            const showDivider =
              index > 0 &&
              tier2Providers.includes(filteredProviderOptions[index - 1].value) &&
              !tier2Providers.includes(option.value);
            const isSelected = selectedProviderType === option.value;

            return (
              <Fragment key={option.value}>
                {showDivider && (
                  <div className="py-2">
                    <div className="h-px w-full bg-border" />
                  </div>
                )}
                <div
                  role="button"
                  tabIndex={disableModelSelection ? -1 : 0}
                  aria-disabled={disableModelSelection}
                  onClick={() => handleProviderTypeSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProviderTypeSelect(option.value);
                    }
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center rounded-lg border p-4 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isSelected ? 'border-2 border-primary bg-primary/5' : 'border-border bg-card',
                    !isSelected &&
                      !disableModelSelection &&
                      'hover:border-primary/50 hover:bg-primary/5',
                    disableModelSelection && 'cursor-not-allowed bg-muted opacity-60',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p
                        className={cn(
                          isSelected ? 'font-semibold text-primary' : 'font-medium text-foreground',
                        )}
                      >
                        {option.label}
                      </p>
                      {option.recommended && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                          {t`Popular`}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {descriptions[option.description] ?? option.description}
                    </p>
                  </div>

                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    {/* Documentation link */}
                    {hasSpecificDocumentation(option.value) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={option.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <HelpCircle className="size-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          {t`View`} {option.label} documentation
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {isSelected && <CheckCircle className="size-5 text-primary" />}
                  </div>
                </div>
              </Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
