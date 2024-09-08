import { formatRootUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default function Demo() {
  redirect(formatRootUrl('hub'));
}
