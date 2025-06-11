import { getProjectConfigBySlug } from '@/lib/api/projects';
import IntegrationCards from '@/components/dashboard/settings/integration-cards';

export default async function IntegrationsSettings({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data, error } = await getProjectConfigBySlug(resolvedParams.slug, 'server');

  if (error) {
    return <div>Error</div>;
  }

  return <IntegrationCards projectSlug={resolvedParams.slug} projectConfig={data} />;
}
