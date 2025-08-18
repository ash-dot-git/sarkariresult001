import RelatedPosts from '@/components/sections/RelatedPosts';

const RelatedPostsSection = ({ category, postId }) => {
  return (
    <RelatedPosts category={category} currentPostId={postId} />
  );
};

export default RelatedPostsSection;