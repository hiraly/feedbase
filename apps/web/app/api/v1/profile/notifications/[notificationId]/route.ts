import { NextResponse } from 'next/server';
import { archiveUserNotification } from '@/lib/api/user';

/*
  Archive a notification
  PATCH /api/v1/profile/notifications/:notificationId
  {
    "archived": true
  }
*/
export async function PATCH(req: Request, context: { params: Promise<{ notificationId: string }> }) {
  const resolvedParams = await context.params;
  // Get notification id
  const { archived } = await req.json();

  // Archive notification
  const { data: notification, error } = await archiveUserNotification(
    'route',
    resolvedParams.notificationId,
    archived
  );

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(notification, { status: 200 });
}
