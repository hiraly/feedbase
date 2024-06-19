'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { CalendarRange, CircleDashed, CircleDotDashed } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { STATUS_OPTIONS } from '@/lib/constants';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import { actionFetcher } from '@/lib/utils';
import AnimatedTabs from '@/components/shared/animated-tabs';
import FeedbackKanban from '../kanban';

type sortingOptions = 'upvotes' | 'created' | 'trending';

export default function RoadmapBoard() {
  const [tab, setTab] = useState('Status');
  const { feedback } = useFeedback();
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const [kanbanData, setKanbanData] = useState(groupFeedbackByStatus());

  // Sort the feedback into groups based on status { 'STATUS': [feedback], ... }
  function groupFeedbackByStatus(): Record<string, FeedbackWithUserProps[]> {
    const groupedFeedback: Record<string, FeedbackWithUserProps[]> = {};
    const statusOptions = new Set(['in review', 'planned', 'in progress', 'completed', 'rejected']);

    feedback?.forEach((f) => {
      const { status } = f;
      const normalizedStatus = status ? status.toLowerCase().replace(/\s/g, ' ') : '';

      if (normalizedStatus && statusOptions.has(normalizedStatus)) {
        const label =
          STATUS_OPTIONS.find(({ label }) => label.toLowerCase().replace(/\s/g, ' ') === normalizedStatus)
            ?.label || '';

        if (!groupedFeedback[label]) {
          groupedFeedback[label] = [];
        }
        groupedFeedback[label].push(f);
      }
    });

    return groupedFeedback;
  }

  Object.values(kanbanData).forEach((feedbackList) => {
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
    setKanbanData(groupFeedbackByStatus());
  }, [feedback]);

  const { trigger: updateFeedback } = useSWRMutation(
    `/api/v1/workspaces/${slug}/feedback`, // using general feedback endpoint here so that it mutates the feedback cache - proper url is set in the inputOverride
    actionFetcher,
    {
      onError: () => {
        toast.error('Failed to update feedback');
        setKanbanData(groupFeedbackByStatus());
      },
    }
  );

  return (
    <>
      {/* Header tabs */}
      <AnimatedTabs
        tabs={[
          {
            label: 'Status',
            icon: CircleDashed,
          },
          {
            label: 'Quarterly',
            icon: CalendarRange,
          },
          {
            label: 'Monthly',
            icon: CircleDotDashed,
          },
        ]}
        selectedTab={tab}
        setSelectedTab={setTab}
      />

      <Separator />

      {/* Kanban Board */}
      {kanbanData ? (
        <FeedbackKanban
          data={kanbanData}
          columns={STATUS_OPTIONS}
          onDataChange={(data, changedFeedback) => {
            // Update feedback
            changedFeedback?.forEach((feedback) => {
              // Get the new status of the feedback
              const newStatus = Object.keys(data).find((status) => data[status].includes(feedback));

              updateFeedback({
                method: 'PATCH',
                status: newStatus,
                inputOverride: `/api/v1/workspaces/${slug}/feedback/${feedback.id}`,
              });
            });

            // Update local feedback - set state here even if we have a effect listener to make it smoother
            setKanbanData(data);
          }}
          sortedBy={(searchParams.get('sort') as sortingOptions) || 'upvotes'}
        />
      ) : null}
    </>
  );
}
