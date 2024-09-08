import { Icons } from '@/components/shared/icons/icons-static';
import { cn } from '@feedbase/ui/lib/utils';

export default function LogoProvider({ className }: { className?: string }) {
  return <Icons.LogoText className={cn('fill-foreground', className)} />;
}
