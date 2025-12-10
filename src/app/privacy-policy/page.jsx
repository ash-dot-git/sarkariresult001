import { ShieldCheck, Info, Lock, Mail } from 'lucide-react';

export async function generateMetadata() {
  const title = 'Privacy Policy';
  const description = 'Read the privacy policy of NewSarkariResult.co.in. Learn how we collect, use, and protect your personal information when you use our website.';
  const url = 'https://newsarkariresult.co.in/privacy-policy';
  const imageUrl = 'https://newsarkariresult.co.in/banner.png';

  return {
    title,
    description,
    keywords: ['privacy policy', 'sarkari result privacy', 'newsarkariresult privacy terms'],
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

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <ShieldCheck className="mr-3 h-6 w-6 text-blue-500" />
            Welcome to NewSarkariResult.co.in
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We are committed to protecting your privacy. This Privacy Policy explains the types of personal information we collect and how it is used at <strong>newsarkariresult.co.in</strong> and <strong>newrojgarresult.com</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="mr-2 h-5 w-5 text-green-500" />
            Information We Collect
          </h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>व्यक्तिगत जानकारी जैसे नाम, ईमेल पता, फ़ोन नंबर आदि।</li>
            <li>Other demographic info like age, gender, etc.</li>
            <li>ब्राउज़र और डिवाइस की जानकारी (जैसे IP पता, ब्राउज़र प्रकार)।</li>
            <li>उपयोग डेटा जैसे विज़िट किए गए पृष्ठ, साइट पर बिताया गया समय।</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="mr-2 h-5 w-5 text-purple-500" />
            How We Use Your Information
          </h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>आपके अनुभव को वैयक्तिकृत करने और रुचि आधारित कंटेंट देने के लिए।</li>
            <li>वेबसाइट को बेहतर बनाने के लिए।</li>
            <li>आपके अनुरोधों और प्रश्नों के जवाब देने के लिए।</li>
            <li>प्रतियोगिता, प्रचार या अन्य सुविधा का संचालन करने के लिए।</li>
            <li>ईमेल के माध्यम से जानकारी और सेवाएं देने के लिए।</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="mr-2 h-5 w-5 text-yellow-500" />
            How We Protect Your Data
          </h3>
          <p className="text-gray-700 leading-relaxed">
            हम विभिन्न सुरक्षा उपायों का उपयोग करते हैं ताकि आपकी व्यक्तिगत जानकारी सुरक्षित रहे। आपकी जानकारी <strong>Sarkari Result</strong> की सुरक्षा नीति के अंतर्गत सुरक्षित रहती है।
          </p>
        </section>

        <section className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-600" />
            Contact Us
          </h3>
          <p className="text-gray-700">
            If you have any questions regarding this Privacy Policy or your data, feel free to reach out to us at:
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
