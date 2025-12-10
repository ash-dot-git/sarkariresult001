import { getCategoryRecords } from '@/services/services-mndb';
import Link from 'next/link';
import { memo } from 'react';

async function getRelatedPosts(category, currentPostId, items=5) {
  try {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-category-records`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       category,
    //       items: 5,
    //       exclude: currentPostId,
    //     },
    //     srvc: "get category records",
    //   }),
    // });

    const data = await getCategoryRecords({
      data: {
        category,
        items: items || 5,
        exclude: currentPostId,
      },
      srvc: "get category records",
    }) //response.json();
    return data?.data?.list || [];
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
}


const RelatedPosts = async ({ category, currentPostId, items=5 }) => {
  const posts = await getRelatedPosts(category, currentPostId, items);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 mb-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        More from {category.replace(/-/g, ' ')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.unique_id}
            href={`/${post.title_slug}`}
            target="_blank"
            rel="noopener"
            className="block p-4 border rounded-lg hover:bg-gray-100"
          >
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.short_information}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default memo(RelatedPosts);