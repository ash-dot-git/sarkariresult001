import { callApi, getAllSlugs } from '@/lib/api-server';
import { notFound } from 'next/navigation';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import MetaDetailsSection from '@/components/sections/MetaDetailsSection';
import { VacancyDetailsSection } from '@/components/sections/VacancyDetailsSection';
import { ImportantLinksSection } from '@/components/sections/ImportantLinksSection';
import { OtherDetailsSection } from '@/components/sections/OtherDetailsSection';
import ImportantDatesAndFees from '@/components/sections/ImportantDatesAndFees';
import { AgeLimitSection } from '@/components/sections/AgeLimitSection';
import { cache } from 'react';
import { getSchemaMarkup } from '@/lib/getSchemaMarkup';
import { getComprehensiveSchema } from '@/lib/getComprehensiveSchema';
import FilterDisplay from '@/components/sections/FilterDisplay';
import RelatedPosts from '@/components/sections/RelatedPosts';
import InArticleAd from '@/components/ads/InArticleAd';
import AdBanner from '@/components/ads/AdBanner';

export const dynamicParams = true;
export const revalidate = 30; // ISR: Refresh after 30s


export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  console.log('Generating static params for slugs:', slugs);
  return slugs.map((slug) => ({
    slug,
  }));
}

const getPostData = cache(async (slug) => {
  const postData = await callApi('getRecordDetails', { title_slug: slug });
  return postData?.data;
});

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  const mainTitle = post.title || 'Untitled Post';
  const description = post.short_information || `Details about ${mainTitle}`;
  const url = `https://newsarkariresult.co.in/${slug}`;
  const imageUrl = post.image_url || 'https://newsarkariresult.co.in/banner.png';

  return {
    title: `${mainTitle}`,
    description,
    keywords: post.keywords || [mainTitle, 'sarkari result', 'government jobs'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: mainTitle,
      description,
      url,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: mainTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: mainTitle,
      description,
      images: [imageUrl],
    },
  };
}

const sectionComponents = {
  'Meta Details': MetaDetailsSection,
  'Vacancy Details': VacancyDetailsSection,
  'Age Limit': AgeLimitSection,
  'Important Links': ImportantLinksSection,
  'Other Details': OtherDetailsSection,
};

export default async function PostDetailPage({ params }) {
  const { slug } = await params

  let post;
  try {
    post = await getPostData(slug);
  } catch (error) {
    console.error(`[PostDetailPage] Failed to fetch data for slug '${slug}':`, error.message);
    notFound();
  }

  if (!post || !post.sections) {
    notFound();
  }

  const datesSection = post.sections?.find(sec => sec?.title === "Important Dates");
  const feeSection = post.sections?.find(sec => sec?.title === "Application Fee");
  const vacancySection = post.sections?.find(sec => sec?.title === "Vacancy Details");
  const ageLimitSection = post.sections?.find(sec => sec.title === "Age Limit");
  const metaSection = post.sections?.find(sec => sec?.title === "Meta Details");
  const nameOfPostField = metaSection?.elements?.find(el => el?.name === "name_of_post");
  const nameOfPost = nameOfPostField?.value || "Post Details";
  const nameOfOrgField = metaSection?.elements?.find(el => el?.name === "name_of_organisation");
  const nameOfOrganisation = nameOfOrgField?.value || "Sarkari Result";
  const otherSection = post.sections?.find(sec => sec?.title === "Other Details")

  

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchemaMarkup({...metaSection, ...post } )) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://newsarkariresult.co.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": post.category,
                "item": `https://newsarkariresult.co.in/${post.category}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://newsarkariresult.co.in/${slug}`
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getComprehensiveSchema({
              pageType: 'WebPage',
              url: `https://newsarkariresult.co.in/${slug}`,
              title: `${post.title} - Sarkari Result`,
              description: post.short_information || `Details about ${post.title}`,
              thumbnailUrl: post.image_url || 'https://newsarkariresult.co.in/banner.png',
              datePublished: post.inserted,
              dateModified: post.updated,
              postTitle: post.title,
              faqSchema: post.faqs ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": post.faqs.map((faq) => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              } : undefined,
            })
          ),
        }}
      />
      <article className="bg-white">
        <AdBanner />
        <div className="pt-5 px-2">
          {metaSection && sectionComponents["Meta Details"] && (
            <MetaDetailsSection
              elements={metaSection?.elements}
              inserted={post?.inserted}
              updated={post?.updated}
              filters={[]}
            />
          )}
          <div className="flex justify-start gap-4 flex-wrap text-blue-600 my-4">
            <a
              href="https://whatsapp.com/channel/0029VbBYkKeATRSvPfHLEx2N"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline"
            >
              <FaWhatsapp className="w-10 h-10 mr-2 text-green-500" />
              Join WhatsApp
            </a>
            <a
              href="https://t.me/newsarkari_result"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline"
            >
              <FaTelegramPlane className="w-10 h-10 mr-2 text-blue-500" />
              Join Telegram
            </a>
          </div>
          {(datesSection || feeSection) && <ImportantDatesAndFees
            datesSection={datesSection}
            feeSection={feeSection}
            orgTitle={nameOfOrganisation}
            title={nameOfPost}
          />
          }
          <InArticleAd />
          {ageLimitSection && sectionComponents["Age Limit"] && (
            <AgeLimitSection elements={ageLimitSection?.elements} />
          )}
          <InArticleAd />
          <VacancyDetailsSection elements={vacancySection?.elements} orgTitle={nameOfOrganisation} title={nameOfPost} />

          <InArticleAd />
          {otherSection && sectionComponents["Other Details"] && (
            <OtherDetailsSection elements={otherSection?.elements} />
          )}

          {post.sections.map((section, index) => {
            if (["Meta Details", "Important Dates", "Application Fee", "Vacancy Details", "Age Limit", "Other Details"].includes(section.title)) {
              return null;
            }
            const Component = sectionComponents[section?.title];
            return Component ? (
              <div key={section?.id}>
                <Component elements={section?.elements} />
                {index % 2 === 0 && <InArticleAd />}
              </div>
            ) : null;
          })}
        </div>
        <InArticleAd />
        <RelatedPosts category={post.category} currentPostId={post.unique_id} />
      </article>
    </main>
  );
}
