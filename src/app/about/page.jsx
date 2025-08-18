import { Metadata } from 'next';
import { Info, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us - Sarkari Result',
  description: 'Know more about NewSarkariResult.co.in — your trusted platform for government job updates, results, admit cards, and educational news in India.',
  keywords: ['About Sarkari Result', 'Sarkari Result site info', 'government job portal India', 'NewSarkariResult'],
  openGraph: {
    title: 'About Us - Sarkari Result',
    description: 'Trusted source for latest Sarkari jobs, results, admit cards, and more. Know who we are and how we help aspirants across India.',
    url: 'https://newsarkariresult.co.in/about',
    siteName: 'Sarkari Result',
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Sarkari Result',
    description: 'Learn about the team behind NewSarkariResult.co.in — providing accurate, timely updates on all govt job exams and results.',
    creator: '@newsarkariresult',
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 text-gray-800">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-900">
          About Us / हमारे बारे में
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-600">
            <Info className="w-6 h-6 mr-2" />
            Who We Are / हम कौन हैं
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify mb-2">
            <strong>English:</strong> NewSarkariResult.co.in is a trusted portal providing timely and accurate information on government job notifications, exam results, admit cards, answer keys, and syllabi across India.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            <strong>हिन्दी:</strong> NewSarkariResult.co.in एक विश्वसनीय पोर्टल है जो पूरे भारत में सरकारी नौकरी से जुड़ी सूचनाएं, रिजल्ट, एडमिट कार्ड, उत्तर कुंजी और पाठ्यक्रम की जानकारी सटीक व समय पर प्रदान करता है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-[#008101]">
            <Users className="w-6 h-6 mr-2" />
            Our Mission & Vision / हमारा मिशन और विजन
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify mb-2">
            <strong>English:</strong> We aim to bridge the gap between aspirants and authentic job updates. Our platform is designed to help every candidate stay ahead with real-time alerts and verified information.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            <strong>हिन्दी:</strong> हमारा उद्देश्य अभ्यर्थियों और सरकारी नौकरियों की वास्तविक जानकारी के बीच की खाई को भरना है। हमारी वेबसाइट रीयल-टाइम अलर्ट और सत्यापित जानकारी के साथ हर उम्मीदवार की मदद करने के लिए डिज़ाइन की गई है।
          </p>
        </section>

        <section className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-yellow-700">
            Why Trust Us? / हम पर भरोसा क्यों करें?
          </h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1 text-sm">
            <li>✅ Daily verified updates from official sources / आधिकारिक स्रोतों से दैनिक सत्यापित अपडेट</li>
            <li>✅ Mobile & desktop friendly design / मोबाइल और डेस्कटॉप फ्रेंडली डिज़ाइन</li>
            <li>✅ No fake alerts or misleading ads / कोई फेक अलर्ट या भ्रामक विज्ञापन नहीं</li>
            <li>✅ Fast loading & clutter-free UI / तेज़ और साफ़ इंटरफेस</li>
          </ul>
        </section>

        <div className="text-sm text-gray-600 mt-6 border-t pt-4">
          <p>
            <strong>📧 Email:</strong>{' '}
            <a href="mailto:sarkariresult.ash@gmail.com" className="text-blue-600 hover:underline">
              sarkariresult.ash@gmail.com
            </a>
          </p>
          <p>
            <strong>🌐 Website:</strong>{' '}
            <a href="https://newsarkariresult.co.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              www.newsarkariresult.co.in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
