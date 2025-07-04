import { NextResponse } from 'next/server';
import { acceptProjectInvite, deleteProjectInvite } from '@/lib/api/invites';

/*
  Accept project invite
  POST /api/v1/projects/[slug]/invites/[inviteId]
*/
export async function POST(req: Request, context: { params: Promise<{ slug: string; inviteId: string }> }) {
  const resolvedParams = await context.params;
  const { data: invite, error } = await acceptProjectInvite(resolvedParams.inviteId, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(invite, { status: 200 });
}

/*
  Delete project invite
  DELETE /api/v1/projects/[slug]/invites/[inviteId]
*/
export async function DELETE(req: Request, context: { params: Promise<{ slug: string; inviteId: string }> }) {
  const resolvedParams = await context.params;
  const { data: invite, error } = await deleteProjectInvite(resolvedParams.inviteId, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(invite, { status: 200 });
}
