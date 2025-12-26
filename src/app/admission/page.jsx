import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admission",
  description:
    "Find the latest admission notifications for various courses and universities. Get timely updates and direct links to apply.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://newsarkariresult.co.in/admission",
  },
  openGraph: {
    title: 'Admission',
    description:"Find the latest admission notifications for various courses and universities. Get timely updates and direct links to apply.",
    url: 'https://newsarkariresult.co.in/about',
    siteName: 'Sarkari Result',
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission',
    description:"Find the latest admission notifications for various courses and universities. Get timely updates and direct links to apply.",
    creator: '@newsarkariresult',
  },
};

export default function AdmissionPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-2">Admission</h1>
      <p className=" text-lg" >
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>. Stay informed about the Admission of various competitive exams conducted by government bodies across India, whether you are waiting for the Job Notification of any recruitment exam, entrance exam or any other government exam then we update the Latest Job from time to time to keep you informed.
        <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
      <p className="mb-4">
        <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" />
        <span className="text-xl font-semibold text-[#0C0A8D] ">
          <Link href='/'>Sarkari Result </Link>
        </span>
        में आपका स्वागत है। भारत भर की सरकारी संस्थाओं द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं के एडमिशन से जुड़ी जानकारी से जुड़े रहें। चाहे आप किसी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा की एडमिशन अधिसूचना का इंतजार कर रहे हों — हम समय-समय पर सभी अपडेट करते हैं ताकि आप हर सूचना से हमेशा अपडेट रहें।
      </p>
      <ListingTable
        title="Admission"
        category="admission"
        items={100} // Set items per page
      />
    </div>
  );
}
