import { NextResponse } from 'next/server';
import { upvoteCommentForFeedbackById } from '@/lib/api/comments';

/*
    Upvote comment for feedback by id
    POST /api/v1/projects/[slug]/feedback/[id]/comments/[id]/upvote
*/
export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string; feedbackId: string; commentId: string }> }
) {
  const resolvedParams = await context.params;
  const { data: comment, error } = await upvoteCommentForFeedbackById(
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
