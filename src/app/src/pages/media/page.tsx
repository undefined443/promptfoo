import { usePageMeta } from '@app/hooks/usePageMeta';
import { t } from '@lingui/core/macro';
import ErrorBoundary from '../../components/ErrorBoundary';
import Media from './Media';

export default function MediaPage() {
  usePageMeta({ title: t`Media Library`, description: t`Browse generated media from evaluations` });

  return (
    <ErrorBoundary name="Media Library">
      <Media />
    </ErrorBoundary>
  );
}
