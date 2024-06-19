import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUp } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';
import { FeedbackWithUserProps } from '@/lib/types';
import { formatTimeAgo } from '@/lib/utils';
import NumberAnimation from '@/components/shared/animated-number';

function FeedbackItem({
  feedback,
  onUpvote,
}: {
  feedback: FeedbackWithUserProps;
  onUpvote: (feedbackId: string) => void;
}) {
  const searchParams = useSearchParams();

  return (
    <div
      className='jusify-between hover:bg-muted/30 group flex h-14 cursor-pointer flex-row items-center border border-b-0 p-1 transition-all [&:first-child]:rounded-t-md [&:last-child]:rounded-b-md [&:last-child]:border-b'
      key={feedback.id}>
      {/* Upvotes & Title */}
      <div className='flex h-full w-full min-w-0 flex-row items-center gap-1.5'>
        {/* Upvotes */}
        <div className='flex h-full items-center'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              onUpvote(feedback.id);
            }}>
            {/* Arrow */}
            <ChevronUp
              className={cn(
                'h-4 w-4 shrink-0 text-sm transition-colors',
                feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
              )}
            />

            {/* Upvotes */}
            <NumberAnimation
              baseNumber={feedback.has_upvoted ? feedback.upvotes - 1 : feedback.upvotes}
              isIncremented={feedback.has_upvoted}
            />
          </Button>
        </div>

        <div className='flex w-full min-w-0 flex-col'>
          <span className='text-foreground line-clamp-1 pr-1 text-[15px] transition-all'>
            {feedback.title}
          </span>

          {/* Description */}
          <div
            className={cn('text-muted-foreground -mt-1 line-clamp-2 max-w-full text-sm', 'transition-all')}
            dangerouslySetInnerHTML={{ __html: feedback.content }}
          />
        </div>
      </div>

      {/* Tags & User */}
      <div className='mr-2 flex flex-shrink-0 items-center gap-2'>
        {/* Tags */}
        {feedback.tags && feedback.tags.length > 0
          ? feedback.tags.map((tag) => (
              <button
                className=' group/tag hover:border-foreground/20 hover:bg-accent/50 hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border px-3 py-1 transition-colors hover:cursor-pointer md:flex'
                key={tag.name.toLowerCase()}
                type='button'
                onClick={(e) => {
                  // Prevent sheet from opening
                  e.stopPropagation();

                  // If already selected, remove the tag
                  if (tag.name.toLowerCase() === searchParams.get('tags')) {
                    // createQueryParams('tags', '');
                  }

                  // createQueryParams('tags', tag.name);
                }}>
                {/* Tag color */}
                <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }} />
                {/* Tag name */}
                <div className='text-foreground/60 group-hover/tag:text-foreground/80 text-xs  transition-colors'>
                  {tag.name}
                </div>
              </button>
            ))
          : null}

        <div className='flex flex-shrink-0 items-center gap-2'>
          {/* Status Icon */}
          {(() => {
            if (feedback.status) {
              const currentStatus =
                STATUS_OPTIONS.find(
                  (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                ) || STATUS_OPTIONS[0];

              return (
                <button
                  className='group/tag hover:border-foreground/20 hover:bg-accent/50 hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border p-1 transition-colors hover:cursor-pointer md:flex'
                  type='button'
                  onClick={(e) => {
                    // Prevent sheet from opening
                    e.stopPropagation();

                    // If already selected, remove the status
                    if (currentStatus.label.toLowerCase() === searchParams.get('status')) {
                      // createQueryParams('status', '');
                    }

                    // createQueryParams('status', currentStatus.label);
                  }}>
                  <currentStatus.icon className='text-foreground/60 h-4 w-4' />
                </button>
              );
            }
            return null;
          })()}

          {/* Date */}
          <div className='text-muted-foreground cursor-default select-none text-center text-xs'>
            {formatTimeAgo(new Date(feedback.created_at))}
          </div>

          {/* User */}
          <Avatar className='h-6 w-6 gap-2 border'>
            <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user.full_name} />
            <AvatarFallback>{feedback.user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapList({
  groupedFeedback,
  onUpvote,
}: {
  groupedFeedback: Record<string, FeedbackWithUserProps[]>;
  onUpvote: (feedbackId: string) => void;
}) {
  return (
    <div className='flex h-full w-full flex-col gap-3'>
      {Object.entries(groupedFeedback).map(([label, feedbackItems]) => {
        // If empty, skip
        if (feedbackItems.length === 0) return null;

        const statusOption = STATUS_OPTIONS.find(
          (option) => option.label.toLowerCase() === label.toLowerCase()
        );

        const Icon = statusOption?.icon;
        const labelText = statusOption?.label || label;

        return (
          <div key={label} className='flex w-full flex-col gap-1.5'>
            <div className='bg-secondary/50 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm'>
              {Icon ? <Icon className='text-muted-foreground h-4 w-4' /> : null}

              <span className='text-foreground'>{labelText}</span>
              <span className='text-muted-foreground text-xs'>{feedbackItems.length}</span>
            </div>
            <div>
              {feedbackItems.map((feedback) => (
                <FeedbackItem key={feedback.id} feedback={feedback} onUpvote={onUpvote} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
