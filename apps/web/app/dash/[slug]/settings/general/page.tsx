import { getProjectBySlug, getProjectConfigBySlug } from '@/lib/api/projects';
import GeneralConfigCards from '@/components/dashboard/settings/general-cards';

export default async function GeneralSettings({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Fetch project data
  const { data: project, error } = await getProjectBySlug(resolvedParams.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch project config
  const { data: projectConfig, error: projectConfigError } = await getProjectConfigBySlug(
    resolvedParams.slug,
    'server'
  );

  if (projectConfigError) {
    return <div>{projectConfigError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      {/* General Card */}
      <GeneralConfigCards projectData={project} projectConfig={projectConfig} />
    </div>
  );
}
