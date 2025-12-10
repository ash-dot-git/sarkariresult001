import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export async function generateMetadata() {
  const title = 'Disclaimer';
  const description = 'Disclaimer for NewSarkariResult.co.in. This website is not affiliated with any government agency. All content is for informational purposes only. Please verify independently.';
  const url = 'https://newsarkariresult.co.in/disclaimer';
  const imageUrl = 'https://newsarkariresult.co.in/banner.png';

  return {
    title,
    description,
    keywords: [
      'sarkari result disclaimer',
      'newsarkariresult disclaimer',
      'not a govt site',
      'verify government job info',
    ],
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

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Disclaimer
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
            General Disclaimer
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>NewSarkariResult.co.in</strong> is a private website and is not associated, endorsed, or affiliated with any government institution, agency, or department. All the content provided here is for informational purposes only and compiled from publicly available and reliable sources.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Although we strive to keep the information accurate and updated, we make no guarantees or warranties — either express or implied — about the completeness, accuracy, reliability, or availability of the data provided.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <ShieldAlert className="mr-3 h-6 w-6 text-yellow-500" />
            अस्वीकरण (Disclaimer in Hindi)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>NewSarkariResult.co.in</strong> एक निजी वेबसाइट है, जो किसी भी सरकारी एजेंसी, विभाग या संस्था से संबद्ध नहीं है। वेबसाइट पर दी गई जानकारी केवल सूचनात्मक उद्देश्य के लिए है और विभिन्न विश्वसनीय स्रोतों से संकलित की गई है।
          </p>
          <p className="text-gray-700 leading-relaxed">
            हम जानकारी को अद्यतन और सटीक रखने का प्रयास करते हैं, लेकिन इसके पूर्णता या शुद्धता की कोई गारंटी नहीं देते हैं।
          </p>
        </section>

        <section className="mb-8 p-6 bg-yellow-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Info className="mr-3 h-6 w-6 text-blue-600" />
            Responsibility & Risk
          </h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            Users are strongly encouraged to independently verify any information before acting on it. We do not take responsibility for any inaccuracies, errors, or outcomes resulting from the use of this site’s content.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Any reliance you place on the content of this website is strictly at your own risk.
          </p>
        </section>

        <div className="text-gray-700 text-right font-medium mt-6">
          — Team NewSarkariResult.co.in
        </div>
      </div>
    </main>
  );
}
