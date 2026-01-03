import fs from 'fs';
import path from 'path';
import ArchiveClient from '@/app/archive/[slug]/ArchiveClient';

// This function runs on the server during the build
export async function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), 'public/content');
  
  if (!fs.existsSync(contentDirectory)) return [];

  const folders = fs.readdirSync(contentDirectory);

  // Filters out the 'editorial' folder if it exists
  return folders
    .filter(folder => folder !== 'editorial')
    .map((folder) => ({
      slug: folder,
    }));
}

// Pass the slug to the Client component as a prop
export default function Page({ params }: { params: { slug: string } }) {
  return <ArchiveClient slug={params.slug} />;
}
