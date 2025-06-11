import { redirect } from 'next/navigation';

export default async function Dashboard({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Redirect to settings/general
  redirect(`/${resolvedParams.slug}/settings/general`);
}
