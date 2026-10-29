import { usePageMeta } from '@app/hooks/usePageMeta';
import { t } from '@lingui/core/macro';
import EvaluateTestSuiteCreator from './components/EvaluateTestSuiteCreator';

export default function EvalCreatorPage() {
  usePageMeta({ title: t`Setup`, description: t`Create a new eval configuration` });
  return <EvaluateTestSuiteCreator />;
}
