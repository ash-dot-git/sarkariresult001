// src/components/ui/SocialFollow.jsx
import Link from 'next/link';

const SocialFollow = () => {
  return (
    <div className="py-6">
      <h3 className="text-center text-2xl font-bold mb-4">Follow Us for Updates</h3>
      <div className="flex justify-center space-x-4">
        <Link href="https://t.me/newsarkari_result"  rel="noopener noreferrer" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Join Telegram
        </Link>
        <Link href="https://whatsapp.com/channel/0029VbBYkKeATRSvPfHLEx2N" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
          Join WhatsApp
        </Link>
      </div>
    </div>
  );
};

export default SocialFollow;