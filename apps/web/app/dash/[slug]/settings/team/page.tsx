import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/components/ui/card';
import { getProjectInvites } from '@/lib/api/invites';
import { getProjectMembers } from '@/lib/api/projects';
import { TeamTable } from '@/components/dashboard/settings/team-table';

export default async function TeamSettings({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data: members, error } = await getProjectMembers(resolvedParams.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  const { data: invites, error: invitesError } = await getProjectInvites(resolvedParams.slug, 'server');

  if (invitesError) {
    return <div>{invitesError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto'>
      <Card className='flex w-full flex-col'>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Add or remove users that have access to this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamTable members={members} invites={invites} projectSlug={resolvedParams.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
