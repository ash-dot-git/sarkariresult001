export function getComprehensiveSchema({
  pageType = 'WebPage',
  url,
  title,
  description,
  thumbnailUrl,
  datePublished,
  dateModified,
  postTitle,
  authorName = 'Sarkari Result',
  faqSchema,
}) {
  const webPage = {
    '@type': pageType === 'SearchResultsPage' ? ['WebPage', 'SearchResultsPage'] : 'WebPage',
    '@id': url,
    url: url,
    name: title,
    description: description,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://newsarkariresult.co.in/#website',
      url: 'https://newsarkariresult.co.in/',
      name: 'Sarkari Result',
      description: 'newsarkariresult.co.in',
      alternateName: 'Sarkari Result',
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://newsarkariresult.co.in/?s={search_term_string}',
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueRequired: 'http://schema.org/True',
          valueName: 'search_term_string',
        },
      },
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      '@id': `${url}#primaryimage`,
      inLanguage: 'en-US',
      url: thumbnailUrl,
      contentUrl: thumbnailUrl,
      width: 1200,
      height: 630,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${url}#primaryimage`,
      inLanguage: 'en-US',
      url: thumbnailUrl,
      contentUrl: thumbnailUrl,
      width: 1200,
      height: 630,
    },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://newsarkariresult.co.in/'
            }
        ]
    },
    author: {
        '@id': 'https://newsarkariresult.co.in/#person'
    }
  };

  if (datePublished) {
    webPage.datePublished = datePublished;
  }

  if (dateModified) {
    webPage.dateModified = dateModified;
  }
  
  if (thumbnailUrl) {
      webPage.thumbnailUrl = thumbnailUrl;
  }

  if (postTitle) {
      webPage.breadcrumb.itemListElement.push({
          '@type': 'ListItem',
          position: 2,
          name: postTitle,
          item: url
      });
  }

  const creativeWork = {
    '@type': 'CreativeWork',
    '@id': `${url}#creativework`,
    author: {
      '@id': 'https://newsarkariresult.co.in/#person'
    }
  };

  const person = {
    '@type': 'Person',
    '@id': 'https://newsarkariresult.co.in/#person',
    name: authorName,
    url: 'https://newsarkariresult.co.in/about'
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      webPage,
      creativeWork,
      person
    ]
  };

  if (faqSchema && faqSchema.mainEntity && faqSchema.mainEntity.length > 0) {
    schema['@graph'].push(faqSchema);
  }

  return schema;
}