import { useDroppable } from '@dnd-kit/core';
import { cn } from '@feedbase/ui/lib/utils';
import type React from 'react';

export function Droppable({
  id,
  children,
  className,
  isOverOverlay,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOverOverlay?: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className={cn('relative', className)}>
      {isOver ? isOverOverlay : null}
      {children}
    </div>
  );
}
