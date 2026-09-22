import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAssessmentResult } from '@/lib/assessment/repository';
import { ResultsTabs } from '@/components/assessment/ResultsTabs';

// DB-backed and not enumerable via generateStaticParams — always rendered
// on demand (D12: reads via getAssessmentResult directly, no HTTP self-call).
export const dynamic = 'force-dynamic';

export default async function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const data = await getAssessmentResult(id);

  if (!data) notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-charcoal-slate/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="flex shrink-0 items-center">
            <Image
              src="/brand/logo-full.png"
              alt="Ignio"
              width={663}
              height={310}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-charcoal-slate sm:text-3xl">
          Tu diagnóstico de preparación emprendedora
        </h1>
        <div className="mt-8">
          <ResultsTabs result={data.result} />
        </div>
      </main>
    </div>
  );
}
