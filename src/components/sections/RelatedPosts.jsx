import { callApi } from '@/lib/api-server';
import Link from 'next/link';

async function getRelatedPosts(category, currentPostId) {
  try {
    const response = await callApi('getCategoryRecords', {
      category,
      items: 5,
      exclude: currentPostId,
    });
    return response?.data?.list || [];
  } catch (error) {
    console.error('Failed to fetch related posts:', error);
    return [];
  }
}

export default async function RelatedPosts({ category, currentPostId }) {
  const posts = await getRelatedPosts(category, currentPostId);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 mb-5">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        More from {category.replace(/-/g, ' ')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.unique_id}
            href={`/${post.title_slug}`}
            target="_blank"
            rel="noopener"
            className="block p-4 border rounded-lg hover:bg-gray-100"
          >
            <h4 className="font-bold text-lg">{post.title}</h4>
            <p className="text-sm text-gray-600">{post.short_information}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}