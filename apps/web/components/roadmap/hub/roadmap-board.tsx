'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { STATUS_OPTIONS } from '@/lib/constants';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import { actionFetcher } from '@/lib/utils';
import { FilterFeedback } from '@/components/feedback/common/feedback-filters';
import FeedbackKanban from '@/components/roadmap/kanban';
import RoadmapList from './roadmap-list';

type sortingOptions = 'upvotes' | 'created' | 'trending';

export default function RoadmapBoard({ style = 'kanban' }: { style: 'kanban' | 'list' }) {
  const { feedback, mutate, isValidating } = useFeedback(true);
  const filteredFeedback = FilterFeedback(feedback || []);
  const { workspace: slug } = useParams<{ workspace: string }>();
  const searchParams = useSearchParams();
  const [groupedFeedbackData, setGroupedFeedbackData] = useState(groupFeedbackByStatus());

  // Sort the feedback into groups based on status { 'STATUS': [feedback], ... }
  function groupFeedbackByStatus(): Record<string, FeedbackWithUserProps[]> {
    let groupedFeedback: Record<string, FeedbackWithUserProps[]> = {};

    // Initialize the groupedFeedback object with empty arrays for each status in STATUS_OPTIONS
    STATUS_OPTIONS.forEach(({ label }) => {
      groupedFeedback[label] = [];
    });

    const statusOptions = new Set(['in review', 'planned', 'in progress', 'completed', 'rejected']);

    filteredFeedback.forEach((feedback) => {
      const { status } = feedback;
      const normalizedStatus = status ? status.toLowerCase().replace(/\s/g, ' ') : '';

      if (normalizedStatus && statusOptions.has(normalizedStatus)) {
        const label =
          STATUS_OPTIONS.find(({ label }) => label.toLowerCase().replace(/\s/g, ' ') === normalizedStatus)
            ?.label || '';

        groupedFeedback[label].push(feedback);
      }
    });

    // Remove empty groups if style === 'kanban'
    if (style === 'kanban') {
      groupedFeedback = Object.fromEntries(
        Object.entries(groupedFeedback).filter(([_, value]) => value.length > 0)
      );
    }

    return groupedFeedback;
  }

  Object.values(groupedFeedbackData).forEach((feedbackList) => {
    switch ((searchParams.get('sort') as sortingOptions) || 'upvotes') {
      case 'upvotes':
        feedbackList.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'created':
        feedbackList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'trending':
        // Most upvotes & comments in the last 7 days
        feedbackList.sort((a, b) => {
          const aScore = a.upvotes + a.comment_count;
          const bScore = b.upvotes + b.comment_count;
          return bScore - aScore;
        });
    }
  });

  // Keep the kanban data in sync with the feedback data
  useEffect(() => {
    setGroupedFeedbackData(groupFeedbackByStatus());
  }, [feedback]);

  const upvoteFeedback = (id: string) => {
    // Find the feedback index
    const feedbackIndex = filteredFeedback.findIndex((f) => f.id === id);

    // Get correct status option
    const statusOption = STATUS_OPTIONS.find(
      (option) => option.label.toLowerCase() === filteredFeedback[feedbackIndex].status.toLowerCase()
    );

    if (!statusOption) {
      return;
    }

    // Set the upvoted state
    setGroupedFeedbackData((prev) => {
      const updatedData = { ...prev };
      updatedData[statusOption.label] = updatedData[statusOption.label].map((f) => {
        if (f.id === filteredFeedback[feedbackIndex].id) {
          return {
            ...f,
            has_upvoted: !f.has_upvoted,
            upvotes: f.has_upvoted ? f.upvotes - 1 : f.upvotes + 1,
          };
        }
        return f;
      });
      return updatedData;
    });

    // Upvote feedback
    fetch(`/api/v1/workspaces/${slug}/feedback/${id}/upvotes`, {
      method: 'POST',
    }).then((res) => {
      if (!res.ok) {
        // Revert the feedback
        setGroupedFeedbackData(groupFeedbackByStatus());
        toast.error('Failed to upvote feedback');
      }
    });
  };

  return (
    <div className='min-h-[100%] w-full'>
      {/* Kanban */}
      {style === 'kanban' && (
        <FeedbackKanban
          data={groupedFeedbackData}
          columns={STATUS_OPTIONS}
          sortedBy={(searchParams.get('sort') as sortingOptions) || 'upvotes'}
          isValidating={isValidating}
          hideEmptyColumns
          publicBoard
        />
      )}

      {/* List */}
      {style === 'list' && <RoadmapList groupedFeedback={groupedFeedbackData} onUpvote={upvoteFeedback} />}
    </div>
  );
}
