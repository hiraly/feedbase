import { notFound } from 'next/navigation';
import { getProjectInvite } from '@/lib/api/invites';
import { getCurrentUser } from '@/lib/api/user';
import ProjectInviteForm from '@/components/layout/accept-invite-form';

export default async function ProjectInvite({ params }: { params: Promise<{ inviteId: string }> }) {
  const resolvedParams = await params;
  const { data: invite, error: inviteError } = await getProjectInvite(resolvedParams.inviteId, 'server');

  if (inviteError) {
    return notFound();
  }

  // Get current user
  const { data: user } = await getCurrentUser('server');

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <ProjectInviteForm invite={invite} user={user} />
    </div>
  );
}
