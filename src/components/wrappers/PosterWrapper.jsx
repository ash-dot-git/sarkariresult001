"use client";

import dynamic from "next/dynamic";

const PosterGenerator = dynamic(() => import("@/components/tools/PosterGenerator"), {
  ssr: false,
});

export default function PosterWrapper({ postTitle, category, orgName, postId, titleSlug}) {
  console.log('wrapper', postId)
  return <PosterGenerator postTitle={postTitle} category={category} orgName={orgName} postId={postId} titleSlug={titleSlug} />;
}
