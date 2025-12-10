import { Mail, User, FileText } from 'lucide-react';

export async function generateMetadata() {
  const title = 'Contact Us';
  const description = 'सरकारी रिजल्ट अपडेट, ऑनलाइन फॉर्म, एडमिट कार्ड, आंसर की, सिलेबस, सरकारी योजनाएं और स्कॉलरशिप्स की जानकारी पाएं। भारत में नवीनतम सरकारी नौकरी अलर्ट के लिए जुड़े रहें — करोड़ों लोगों का भरोसेमंद स्रोत।';
  const url = 'https://newsarkariresult.co.in/contact';
  const imageUrl = 'https://newsarkariresult.co.in/banner.png';

  return {
    title,
    description,
    keywords: ['contact sarkari result', 'newsarkariresult.co.in contact', 'contact us', 'sarkari result support'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}


export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Contact Us
        </h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Mail className="mr-3 h-6 w-6 text-blue-500" />
            Contact with NewSarkariResult.co.in
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
          हम NewSarkariResult.co.in में आपकी रुचि की सराहना करते हैं। यदि आपके कोई प्रश्न, सुझाव हैं, या सहायता की आवश्यकता है, तो कृपया बेझिझक हमसे संपर्क करें। हमारी टीम मदद के लिए यहां है!
          </p>
        </section>

        <section className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
          <p className="text-gray-700">
            For general inquiries, support, or feedback, please contact us at:
          </p>
          <a href="mailto:sarkariresult.ash@gmail.com" className="text-blue-600 hover:underline font-medium flex items-center mt-2">
            <Mail className="mr-2 h-5 w-5" />
            sarkariresult.ash@gmail.com
          </a>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <User className="mr-3 h-6 w-6 text-green-500" />
            About The Author
          </h2>
          <p className="text-gray-700 leading-relaxed">
          At newsarkariresult.co.in, our editorial team is committed to delivering accurate and timely updates related to education, government jobs, and competitive exams. We focus on providing high-quality content to help aspirants stay informed and well-prepared, ensuring that the information shared is reliable, clear, and useful for career-building decisions.
          </p>
          <a href="mailto:sarkariresult.ash@gmail.com" className="text-blue-600 hover:underline font-medium flex items-center mt-2">
            <Mail className="mr-2 h-5 w-5" />
            sarkariresult.ash@gmail.com
          </a>
        </section>

        <section className="p-6 bg-yellow-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="mr-3 h-6 w-6 text-yellow-500" />
            Content Transparency
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
          At newsarkariresult.co.in , our team writes articles based on research, using information from reliable sources like well-known news publications, official websites, press releases, and official documents. We aim to give you accurate and trustworthy information, following our guidelines for quality and fact-checking.
          </p>
          <p className="text-gray-700 leading-relaxed">
          If you have questions or want to suggest changes to any content on our website, you can reach out to us at:
          </p>
          <a href="mailto:sarkariresult.ash@gmail.com" className="text-blue-600 hover:underline font-medium flex items-center mt-2">
            <Mail className="mr-2 h-5 w-5" />
            sarkariresult.ash@gmail.com
          </a>
        </section>
      </div>
    </main>
  );
}