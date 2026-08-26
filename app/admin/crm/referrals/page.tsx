import ReferralsClient from './ReferralsClient';

export const metadata = {
  title: 'Referrals & Loyalty | Admin Dashboard',
};

export default function ReferralsPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReferralsClient />
    </div>
  );
}
