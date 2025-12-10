export function getSchemaMarkup(post) {
  const {
    title_slug,
    title,
    short_information,
    image_url,
    inserted,
    updated,
    metaSection = {},
    category = '',
    exam_type = [],
    applicable_states = [],
    minimum_qualification = [],
    other_tags = [],
  } = post;

  const getMetaValue = (key) => {
    return metaSection?.elements?.find(el => el?.name === key)?.value || '';
  };

  
  const nameOfOrganisation = getMetaValue("name_of_organisation") || "Sarkari Result";
  const nameOfPost = getMetaValue("name_of_post") || "Job Vacancy";

  const keywords = [
    ...exam_type,
    ...applicable_states,
    ...minimum_qualification,
    ...other_tags,
    category,
    nameOfOrganisation,
    nameOfPost,
  ].filter(Boolean);

  const url = `https://newsarkariresult.co.in/${title_slug}`;
  const baseArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "keywords": keywords.join(', '),
    "description": short_information || "Posted by New Sarkar Result",
    "image": [{
      "@type": "ImageObject",
      "url": image_url || "https://newsarkariresult.co.in/banner.png",
      "caption": `${title} Image`,
      "name": `${title} Image`
    }],
    "author": {
      "@type": "Organization",
      "name": "Sarkari Result"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sarkari Result",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newsarkariresult.co.in/logo.png"
      }
    },
    "datePublished": formatReadableDate(inserted, true) || new Date().toISOString()
  };

  // 🎯 If it's a job type, return JobPosting schema
  if ( category === 'latest-jobs') {
    return {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": title,
      "description": short_information || "Posted by New Sarkar Result",
      "keywords": keywords.join(', '),
      "datePosted": formatReadableDate(inserted, true) || new Date().toISOString(),
      "validThrough": updated? formatReadableDate(updated, true) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // default +7 days
      "employmentType": "FULL_TIME",
      "image": {
        "@type": "ImageObject",
        "url": image_url || "https://newsarkariresult.co.in/banner.png",
        "caption": `${title} Image`,
        "name": `${title} Image`
      },
      "hiringOrganization": {
        "@type": "Organization",
        "name": nameOfOrganisation,
        "sameAs": "https://newsarkariresult.co.in",
        "logo": "https://newsarkariresult.co.in/logo.png"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "NA",
          "addressLocality": "India",
          "addressRegion": "NA",
          "postalCode": "000000",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": 0,
          "unitText": "MONTH"
        }
      }
    };
  }

  // ✳️ Syllabus-specific schema
  if (category === 'syllabus') {
    return {
      ...baseArticle,
      "@type": "CreativeWork",
      "about": title
    };
  }

  // 🎓 Admissions-specific schema
  if (category === 'admission') {
    return {
      ...baseArticle,
      "@type": "EducationalOccupationalProgram",
      "educationalProgramMode": "online",
      "name": title,
      "description": short_information,
      "image": {
        "@type": "ImageObject",
        "url": image_url || "https://newsarkariresult.co.in/banner.png",
        "caption": `${title} Image`,
        "name": `${title} Image`
      },
      "provider": {
        "@type": "Organization",
        "name": "Sarkari Result"
      }
    };
  }

  // 🏛️ Sarkari Yojna schema
  if (category === 'sarkari-yojna') {
    return {
      "@context": "https://schema.org",
      "@type": "GovernmentService",
      "name": title,
      "description": short_information,
      "provider": {
        "@type": "GovernmentOrganization",
        "name": "Government of India"
      },
      "serviceType": "Sarkari Yojna",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      }
    };
  }

  // 🔖 Fallback: Article for admit card, result, answer-key, documents, etc.
  return baseArticle;
}

function formatReadableDate(input, time = false) {
    input = String(input).trim();
    let date;

    // DD-MM-YYYY or DD/MM/YYYY
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(input)) {
      const [day, month, year] = input.split(/[-/]/);
      date = new Date(`${year}-${month}-${day}`);
    }
    // YYYY-MM-DD or YYYY/MM/DD
    else if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(input)) {
      const [year, month, day] = input.split(/[-/]/);
      date = new Date(`${year}-${month}-${day}`);
    }
    // Milliseconds
    else if (!isNaN(input)) {
      date = new Date(Number(input));
    } else {
      return 'Invalid Date';
    }

    // Check for valid date
    if (isNaN(date.getTime())) return 'Invalid Date';

    // Format options
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };

    // Add time if requested
    if (time) {
      return date.toISOString();
    }

    return date.toLocaleDateString('en-IN', dateOptions);
  }