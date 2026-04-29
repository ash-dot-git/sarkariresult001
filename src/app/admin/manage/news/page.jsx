import ManageNewsClient from '@/components/sections/ManageNewsClient';

export const metadata = {
  title: 'News Management - Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManageNewsPage() {
  return (
    <div className="bg-gray-100 min-h-screen pt-8 pb-16">
      <ManageNewsClient />
    </div>
  );
}
