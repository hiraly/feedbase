import { NextResponse } from 'next/server';
import { deleteCommentForFeedbackById } from '@/lib/api/comments';

/*
    Delete comment for feedback by id
    DELETE /api/v1/projects/[slug]/feedback/[id]/comments/[id]
*/
export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string; feedbackId: string; commentId: string }> }
) {
  const resolvedParams = await context.params;
  const { data: comment, error } = await deleteCommentForFeedbackById(
    resolvedParams.commentId,
    resolvedParams.feedbackId,
    resolvedParams.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comment
  return NextResponse.json(comment, { status: 200 });
}
