import { redirect } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Redirect to changelog
  redirect(`/${resolvedParams.slug}/changelog`);
}
