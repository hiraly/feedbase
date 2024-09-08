import { formatRootUrl } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default function Docs() {
  redirect(formatRootUrl('docs'));
}
