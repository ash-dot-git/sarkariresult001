import ManagePageClient from '@/components/sections/ManagePageClient';

// This is the Server Component.
// It handles server-side concerns like metadata.
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// The Server Component then renders the Client Component
// which handles all the user interaction.
export default function ManageRecordPage() {
  return <ManagePageClient />;
}
