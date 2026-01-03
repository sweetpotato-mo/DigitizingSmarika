import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import ArchiveClient from './ArchiveClient';

export async function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), 'public/content');
  
  if (!fs.existsSync(contentDirectory)) return [];

  const folders = fs.readdirSync(contentDirectory);

  return folders
    .filter(folder => folder !== 'editorial')
    .map((folder) => ({
      slug: folder,
    }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    // Mandatory Suspense boundary for Next.js Static Site Generation (SSG)
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center pt-20 font-lora text-stone-400">
        Loading Article...
      </div>
    }>
      <ArchiveClient slug={params.slug} />
    </Suspense>
  );
}