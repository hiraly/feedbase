import { notFound, redirect } from 'next/navigation';
import { getProjectBySlug } from '@/lib/api/projects';
import UnsubscribeChangelogCard from '@/components/layout/unsubscribe-card';

export default async function ChangelogUnsubscribe({
  params,
  searchParams,
}: {
  params: Promise<{ project: string }>;
  searchParams: Promise<{ subId: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!resolvedSearchParams.subId) {
    redirect('/');
  }

  // Check if subId is in uuid format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(resolvedSearchParams.subId)) {
    redirect('/');
  }

  // Get project
  const { data: project, error } = await getProjectBySlug(resolvedParams.project, 'server', true, false);

  // If project is undefined redirects to 404
  if (error?.status === 404 || !project) {
    notFound();
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <UnsubscribeChangelogCard project={project} subId={resolvedSearchParams.subId} />
    </div>
  );
}
