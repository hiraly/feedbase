import { BarChart } from '@/components/analytics/bar-chart';
import { LineChart } from '@/components/analytics/line-chart';
import { getWorkspaceAnalytics } from '@/lib/api/workspace';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@feedbase/ui/components/select';
import React from 'react';

export default async function AnalyticsPage({ params }: { params: { slug: string } }) {
  const { data, error } = await getWorkspaceAnalytics(params.slug, 'server');

  if (!data) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col'>
      {/* Header */}
      <div className='flex h-[52px] w-full flex-row items-center justify-between px-5 pt-5'>
        <h2 className='text-2xl font-medium'>Analytics</h2>

        <div className='flex items-center gap-3'>
          {/* Timeframe */}
          <Select>
            <SelectTrigger className='w-[160px] rounded-lg sm:ml-auto' aria-label='Select a value'>
              <SelectValue placeholder='Last 3 months' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='90d' className='rounded-lg'>
                Last 3 months
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg'>
                Last 30 days
              </SelectItem>
              <SelectItem value='7d' className='rounded-lg'>
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className='grid w-full grid-cols-2 gap-5 p-5'>
        <LineChart />
        <BarChart />
        <BarChart />
      </div>
    </div>
  );
}
