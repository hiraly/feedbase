import { getProjectBySlug, getProjectConfigBySlug } from '@/lib/api/projects';
import HubConfigCards from '@/components/dashboard/settings/hub-cards';

export default async function HubSettings({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Fetch project data
  const { data: project, error } = await getProjectBySlug(resolvedParams.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch project config
  const { data: projectConfig, error: configError } = await getProjectConfigBySlug(
    resolvedParams.slug,
    'server'
  );

  if (configError) {
    return <div>{configError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      {/* Hub Card */}
      <HubConfigCards projectData={project} projectConfigData={projectConfig} />
    </div>
  );
}
