import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Separator } from '@ui/components/ui/separator';
import { getProjectBySlug, getProjectConfigBySlug } from '@/lib/api/projects';
import { getPublicProjectFeedback } from '@/lib/api/public';
import { getCurrentUser } from '@/lib/api/user';
import AnalyticsWrapper from '@/components/hub/analytics-wrapper';
import FeedbackHeader from '@/components/hub/feedback/button-header';
import FeedbackList from '@/components/hub/feedback/feedback-list';

type Props = {
  params: Promise<{ project: string }>;
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  // Get project
  const { data: project, error } = await getProjectBySlug(resolvedParams.project, 'server', true, false);

  // If project is undefined redirects to 404
  if (error?.status === 404 || !project) {
    notFound();
  }

  return {
    title: `Feedback - ${project.name}`,
    description: 'Have a suggestion or found a bug? Let us know!',
  };
}

export default async function Feedback({ params }: Props) {
  const resolvedParams = await params;
  // Get current user
  const { data: user } = await getCurrentUser('server');

  const { data: feedback, error } = await getPublicProjectFeedback(
    resolvedParams.project,
    'server',
    true,
    false
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch project config if user not logged in
  const { data: config } = await getProjectConfigBySlug(resolvedParams.project, 'server', true, false);

  return (
    <AnalyticsWrapper className='items-center gap-10 pb-10' projectSlug={resolvedParams.project}>
      {/* Header */}
      <div className='flex w-full px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='text-3xl font-medium sm:text-4xl'>Feedback</h1>
          <p className='text-foreground/70 text-base font-extralight sm:text-lg'>
            Have a suggestion or found a bug? Let us know!
          </p>
        </div>
      </div>

      {/* Seperator */}
      <Separator className='bg-border/60' />

      {/* content */}
      <div className='flex h-full w-full flex-col items-center justify-center gap-5 px-5 sm:px-10 md:px-10 lg:px-20'>
        <FeedbackHeader isLoggedIn={!!user} projectSlug={resolvedParams.project} projectConfig={config} />

        {/* Main */}
        <div className='flex h-full w-full flex-col justify-between'>
          <FeedbackList
            feedback={feedback}
            projectSlug={resolvedParams.project}
            isLoggedIn={!!user}
            projectConfig={config}
          />
        </div>
      </div>
    </AnalyticsWrapper>
  );
}
