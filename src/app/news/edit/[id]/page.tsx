import { getAllNews } from '../../../../services/newsService';
import NewsEditClient from './NewsEditClient';

export async function generateStaticParams() {
  const news = await getAllNews();
  return news.map((item) => ({
    id: item.id,
  }));
}

export default function NewsEditPage({ params }: { params: { id: string } }) {
  return <NewsEditClient id={params.id} />;
} 