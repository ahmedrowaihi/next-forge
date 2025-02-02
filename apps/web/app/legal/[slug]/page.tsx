import { notFound } from 'next/navigation';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { createMetadata } from '@repo/design-system/lib/metadata';
import { Container } from '@repo/design-system/components/container';
import { allLegals } from '@contentlayer/generated';
import { baseUrl } from '~/lib/consts';
import type { FC } from 'react';
import type { Metadata } from 'next';
import { Mdx } from '@/components/mdx';
import { Sidebar } from '@/components/sidebar';

type LegalPageProps = {
  readonly params: {
    slug: string;
  };
};

export const dynamic = 'force-dynamic';

export const generateMetadata = ({ params }: LegalPageProps): Metadata => {
  const currentPath = params.slug;
  const doc = allLegals.find(
    ({ slugAsParams }) => slugAsParams === currentPath
  );

  if (!doc) {
    return {};
  }

  return createMetadata({
    title: doc.title,
    description: doc.description,
    image: doc.image,
  });
};

export const generateStaticParams = (): LegalPageProps['params'][] =>
  allLegals.map((doc) => ({
    slug: doc.slug,
  }));

const LegalPage: FC<LegalPageProps> = ({ params }) => {
  const currentPath = params.slug;
  const doc = allLegals.find(
    ({ slugAsParams }) => slugAsParams === currentPath
  );

  if (!doc) {
    notFound();
  }

  const images: string[] = [];

  if (doc.image) {
    const imageUrl = new URL(doc.image, baseUrl).href;
    images.push(imageUrl);
  }

  return (
    <Container className="py-16 max-w-5xl">
      <Link
        className="mb-4 inline-flex items-center gap-1 text-sm text-white/50 decoration-white/30 transition-colors hover:text-white/70 focus:text-white focus:underline focus:outline-none"
        href="/blog"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Blog
      </Link>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        <Balancer>{doc.title}</Balancer>
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        <Balancer>{doc.description}</Balancer>
      </p>
      <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
        <div className="sm:flex-1">
          <div className="prose prose-zinc dark:prose-invert">
            <Mdx code={doc.body.code} />
          </div>
        </div>
        <div className="sticky top-24 hidden shrink-0 md:block">
          <Sidebar doc={doc} />
        </div>
      </div>
    </Container>
  );
};

export default LegalPage;
