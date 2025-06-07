import { getAllNews } from '../../../services/newsService';
import NewsDetailClient from '@/app/news/[id]/NewsDetailClient';

export async function generateStaticParams() {
  const news = await getAllNews();
  return news.map((item) => ({
    id: item.id,
  }));
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  return <NewsDetailClient id={params.id} />;
} 