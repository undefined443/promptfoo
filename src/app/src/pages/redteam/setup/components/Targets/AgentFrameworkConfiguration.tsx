import { useState } from 'react';

import { Alert, AlertContent, AlertDescription } from '@app/components/ui/alert';
import { Button } from '@app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { useTelemetry } from '@app/hooks/useTelemetry';
import { t } from '@lingui/core/macro';
import { AlertTriangle, Code, Copy, Download, Info } from 'lucide-react';
import { AGENT_TEMPLATE } from './consts';

import type { ProviderOptions } from '../../types';

interface AgentFrameworkConfigurationProps {
  selectedTarget: ProviderOptions;
  updateCustomTarget: (field: string, value: unknown) => void;
  agentType: string;
}

const frameworkInfo: Record<string, { name: string; description: string; pip: string }> = {
  langchain: {
    name: 'LangChain',
    description: t`Framework for developing applications powered by language models`,
    pip: 'langchain langchain-openai',
  },
  autogen: {
    name: 'AutoGen',
    description: t`Multi-agent collaborative framework from Microsoft`,
    pip: 'pyautogen',
  },
  crewai: {
    name: 'CrewAI',
    description: t`Framework for orchestrating role-playing autonomous AI agents`,
    pip: 'crewai',
  },
  llamaindex: {
    name: 'LlamaIndex',
    description: t`Data framework for LLM applications with RAG capabilities`,
    pip: 'llama-index',
  },
  langgraph: {
    name: 'LangGraph',
    description: t`Build stateful, multi-actor applications with LLMs`,
    pip: 'langgraph langchain-openai',
  },
  'openai-agents-sdk': {
    name: 'OpenAI Agents SDK',
    description: t`Official OpenAI SDK for building AI agents.`,
    pip: 'openai-agents',
  },
  'pydantic-ai': {
    name: 'PydanticAI',
    description: t`Type-safe AI agents with structured outputs using Pydantic`,
    pip: 'pydantic-ai',
  },
  'google-adk': {
    name: 'Google ADK',
    description: t`Google AI Development Kit for building agents with Gemini`,
    pip: 'google-genai',
  },
  'generic-agent': {
    name: 'Other Agent',
    description: t`Any agent framework - promptfoo is fully customizable and supports all agent frameworks`,
    pip: '# Install your agent framework dependencies',
  },
};

export default function AgentFrameworkConfiguration({
  selectedTarget,
  updateCustomTarget,
  agentType,
}: AgentFrameworkConfigurationProps) {
  const [copied, setCopied] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const { recordEvent } = useTelemetry();

  const frameworkDetails = frameworkInfo[agentType] || {
    name: agentType,
    description: t`Agent framework`,
    pip: agentType,
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(AGENT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track template copy event
    recordEvent('feature_used', {
      feature: 'redteam_agent_template_copied',
      agent_framework: agentType,
      framework_name: frameworkDetails.name,
    });
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([AGENT_TEMPLATE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = agentType === 'generic-agent' ? 'custom_agent.py' : `${agentType}_agent.py`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Track template download event
    recordEvent('feature_used', {
      feature: 'redteam_agent_template_downloaded',
      agent_framework: agentType,
      framework_name: frameworkDetails.name,
      filename: filename,
    });
  };

  const handleOpenTemplateModal = () => {
    setTemplateModalOpen(true);
    recordEvent('feature_used', {
      feature: 'redteam_agent_template_modal_opened',
      agent_framework: agentType,
      framework_name: frameworkDetails.name,
    });
  };

  const handleCloseTemplateModal = () => {
    setTemplateModalOpen(false);
    setCopied(false);
  };

  const templateFilename = 'agent_template.py';

  return (
    <div>
      <Alert variant="info" className="mb-6">
        <Info className="size-4" />
        <AlertContent>
          <AlertDescription>
            <p className="mb-2 font-semibold">
              {frameworkDetails.name} {t`Agent Configuration`}
            </p>
            <p className="mb-3">{frameworkDetails.description}</p>
            {agentType === 'generic-agent' ? (
              <p className="italic">
                <strong>{t`Tip:`}</strong>{' '}
                {t`Promptfoo works with ANY Python-based agent framework. Simply implement the call_api function in your Python file to connect your agent.`}
              </p>
            ) : (
              <p className="font-mono text-xs">
                {t`Install with:`}{' '}
                <strong>
                  {t`pip install`} {frameworkDetails.pip}
                </strong>
              </p>
            )}
          </AlertDescription>
        </AlertContent>
      </Alert>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="provider-id">
            {t`Provider ID (Python file path)`} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="provider-id"
            value={selectedTarget.id || ''}
            onChange={(e) => updateCustomTarget('id', e.target.value)}
            placeholder={`file:///path/to/${agentType}_agent.py`}
          />
          <p className="text-sm text-muted-foreground">{t`Path to your Python agent implementation file`}</p>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">{t`Quickstart Template`}</h3>
          <p className="mb-4 max-w-[1000px] text-muted-foreground">
            {t`Want to see how it works? Promptfoo can generate a starter template for`}{' '}
            {frameworkDetails.name}{' '}
            {t`that shows you how to connect your agent to the red team evaluation system. You can use this as a starting point and customize it to fit your needs.`}
          </p>
          <Button onClick={handleOpenTemplateModal}>
            <Code className="mr-2 size-4" />
            {t`Generate Template File`}
          </Button>
        </div>
      </div>

      {/* Template Modal */}
      <Dialog open={templateModalOpen} onOpenChange={(open) => !open && handleCloseTemplateModal()}>
        <DialogContent className="flex max-h-[85vh] min-h-0 flex-col overflow-hidden sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {frameworkDetails.name} {t`Template -`} {templateFilename}
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-4">
            <Alert variant="warning">
              <AlertTriangle className="size-4" />
              <AlertContent>
                <AlertDescription>
                  <p className="font-semibold">{t`Next Steps:`}</p>
                  <ol className="ml-5 mt-2 list-decimal">
                    <li>{t`Save the template to a Python file`}</li>
                    {agentType === 'generic-agent' ? (
                      <>
                        <li>{t`Install your agent framework's dependencies`}</li>
                        <li>
                          {t`Replace the TODOs in the`} <code>call_api</code>{' '}
                          {t`function with your agent implementation`}
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          {t`Install required dependencies:`}{' '}
                          <code className="rounded bg-muted px-1">
                            pip install {frameworkDetails.pip}
                          </code>
                        </li>
                        <li>
                          {t`Customize the agent logic in the`} <code>call_api</code> function
                        </li>
                      </>
                    )}
                    <li>{t`Update the Provider ID field above with the file path`}</li>
                  </ol>
                </AlertDescription>
              </AlertContent>
            </Alert>

            <div className="rounded-lg border border-border bg-muted/50 p-4 dark:bg-zinc-900">
              <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
                <code>{AGENT_TEMPLATE}</code>
              </pre>
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-2">
            <Button variant="outline" onClick={handleCopyTemplate} disabled={copied}>
              <Copy className="mr-2 size-4" />
              {copied ? t`Copied!` : t`Copy Template`}
            </Button>
            <Button onClick={handleDownloadTemplate}>
              <Download className="mr-2 size-4" />
              {t`Download`} {templateFilename}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
