import { useEffect } from 'react';

import { Spinner } from '@app/components/ui/spinner';
import { usePageMeta } from '@app/hooks/usePageMeta';
import { useUserStore } from '@app/stores/userStore';
import { t } from '@lingui/core/macro';
import { useNavigate, useSearchParams } from 'react-router';
import Report from './components/Report';
import ReportIndex from './components/ReportIndex';

export default function ReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { email, isLoading, fetchEmail } = useUserStore();
  const evalId = searchParams.get('evalId');
  usePageMeta({
    title: t`Red Team Vulnerability Reports`,
    description: t`View or browse red team results`,
  });

  useEffect(() => {
    fetchEmail();
  }, [fetchEmail]);

  useEffect(() => {
    if (!isLoading && !email) {
      navigate(`/login?type=report&redirect=${window.location.pathname}${window.location.search}`);
    }
  }, [isLoading, email, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-36">
        <Spinner className="size-6" />
        <span className="text-sm text-muted-foreground">{t`Waiting for report data`}</span>
      </div>
    );
  }

  if (!email) {
    // This will prevent a flash of content before redirect
    return null;
  }

  return evalId ? <Report /> : <ReportIndex />;
}
