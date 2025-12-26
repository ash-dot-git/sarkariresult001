import { Metadata } from 'next';
import { Info, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'NewSarkariResult.co.in is your authentic and trusted platform for government job updates, results, admit cards, and educational news in India. Verified and accurate information every time.',
  keywords: [
    'About Sarkari Result',
    'Sarkari Result site info',
    'government job portal India',
    'authentic Sarkari jobs',
    'NewSarkariResult',
    'government exam results',
    'admit cards India',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About Us - NewSarkariResult.co.in',
    description: 'Trusted source for latest Sarkari jobs, results, admit cards, and more. Verified and authentic information for aspirants across India.',
    url: 'https://newsarkariresult.co.in/about',
    siteName: 'Sarkari Result',
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us',
    description: 'Learn about the team behind NewSarkariResult.co.in — providing accurate, verified, and timely updates on government jobs and results.',
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

        {/* Who We Are */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-600">
            <Info className="w-6 h-6 mr-2" />
            Who We Are / हम कौन हैं
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify mb-2">
            <strong>English:</strong> NewSarkariResult.co.in is a 100% authentic portal for government job notifications, results, admit cards, answer keys, syllabus updates, and other educational news across India. We operate under a registered `.in` domain and maintain official documentation submitted on stamp paper, ensuring our authenticity and legal compliance.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            <strong>हिन्दी:</strong> NewSarkariResult.co.in एक विश्वसनीय और प्रमाणित पोर्टल है जो पूरे भारत में सरकारी नौकरी की सूचनाएं, रिज़ल्ट, एडमिट कार्ड, उत्तर कुंजी और पाठ्यक्रम अपडेट प्रदान करता है। हमारी टीम 14+ वर्षों के अनुभव के साथ काम करती है और हम सभी दस्तावेज़ सरकारी नियमों के अनुसार स्टाम्प पेपर पर जमा कर चुके हैं, जिससे हमारी वैधता और प्रमाणिकता सुनिश्चित होती है।
          </p>
        </section>

        {/* Our Mission & Vision */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-[#008101]">
            <Users className="w-6 h-6 mr-2" />
            Our Mission & Vision / हमारा मिशन और विजन
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify mb-2">
            <strong>English:</strong> Our mission is to provide aspirants with **accurate, timely, and verified government job information**. Each update is cross-checked multiple times by our experienced team to ensure authenticity and clarity. This helps users easily understand and act on the information without confusion.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            <strong>हिन्दी:</strong> हमारा उद्देश्य अभ्यर्थियों को सटीक, समय पर और सत्यापित सरकारी नौकरी की जानकारी प्रदान करना है। हमारी टीम प्रत्येक अपडेट को कई बार क्रॉस-चेक करती है ताकि सूचनाओं की प्रमाणिकता, स्पष्टता और विश्वसनीयता सुनिश्चित हो सके। इससे उपयोगकर्ताओं को आसानी से समझने और सही समय पर कार्रवाई करने में मदद मिलती है।
          </p>
        </section>

        {/* Why Trust Us */}
        <section className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-yellow-700">
            Why Trust Us? / हम पर भरोसा क्यों करें?
          </h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1 text-sm">
            <li>✅ Operated by a 14+ year experienced team / 14+ वर्षों के अनुभवी टीम द्वारा संचालित</li>
            <li>✅ Verified updates from official government sources / सरकारी स्रोतों से सत्यापित अपडेट</li>
            <li>✅ Each information cross-checked multiple times / हर जानकारी कई बार क्रॉस-चेक की जाती है</li>
            <li>✅ No fake alerts, no login required, user privacy respected / कोई फेक अलर्ट नहीं, लॉगिन की आवश्यकता नहीं, उपयोगकर्ता की गोपनीयता सुरक्षित</li>
            <li>✅ Helps summarize complex updates into easy-to-understand posts / जटिल जानकारी को सरल और समझने योग्य पोस्ट में प्रस्तुत करना</li>
            <li>✅ We show ads only to support our team; not earning from posts / विज्ञापन केवल हमारी टीम का समर्थन करने के लिए; पोस्ट से आमदनी नहीं</li>
            <li>✅ Fully compliant with legal regulations and registered domain / कानूनी नियमों के अनुसार पूरी तरह से अनुपालन और पंजीकृत डोमेन</li>
          </ul>
        </section>

        {/* Contact Info */}
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
